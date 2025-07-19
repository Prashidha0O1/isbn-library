import requests
import re
import time
from bs4 import BeautifulSoup
from django.core.cache import cache
from django.conf import settings
from .models import Book, SearchHistory
import logging  
from decouple import config

GOOGLE_BOOKS_API_KEY = config('GOOGLE_BOOKS_API_KEY')
logger = logging.getLogger(__name__)

class ISBNService:
    """Service class to handle ISBN lookups from multiple sources"""
    
    def __init__(self):
        self.sources = [
            self._fetch_from_google_books,
            self._fetch_from_openlibrary,
            self._fetch_from_worldcat,
        ]
    
    def normalize_isbn(self, isbn):
        """Clean and normalize ISBN"""
        isbn = re.sub(r'[^0-9X]', '', isbn.upper())
        return isbn
    
    def validate_isbn(self, isbn):
        """Validate ISBN-10 or ISBN-13"""
        isbn = self.normalize_isbn(isbn)
        
        if len(isbn) == 10:
            return self._validate_isbn10(isbn)
        elif len(isbn) == 13:
            return self._validate_isbn13(isbn)
        return False
    
    def _validate_isbn10(self, isbn):
        """Validate ISBN-10"""
        if len(isbn) != 10:
            return False
        
        check = 0
        for i, char in enumerate(isbn[:-1]):
            check += int(char) * (10 - i)
        
        check_digit = isbn[-1]
        remainder = check % 11
        
        if remainder == 0:
            return check_digit == '0'
        elif remainder == 1:
            return check_digit == 'X'
        else:
            return check_digit == str(11 - remainder)
    
    def _validate_isbn13(self, isbn):
        """Validate ISBN-13"""
        if len(isbn) != 13:
            return False
        
        check = 0
        for i, char in enumerate(isbn[:-1]):
            if i % 2 == 0:
                check += int(char)
            else:
                check += int(char) * 3
        
        remainder = check % 10
        check_digit = (10 - remainder) % 10
        
        return str(check_digit) == isbn[-1]
    
    def search_book(self, isbn):
        """Main method to search for a book by ISBN"""
        start_time = time.time()
        isbn = self.normalize_isbn(isbn)
        
        # Validate ISBN
        if not self.validate_isbn(isbn):
            SearchHistory.objects.create(
                isbn=isbn,
                found=False,
                response_time_ms=int((time.time() - start_time) * 1000)
            )
            return None, "Invalid ISBN format"
        
        # Check cache first
        cache_key = f"isbn_{isbn}"
        cached_result = cache.get(cache_key)
        if cached_result:
            SearchHistory.objects.create(
                isbn=isbn,
                found=True,
                response_time_ms=int((time.time() - start_time) * 1000),
                data_source="cache"
            )
            return cached_result, None
        
        # Check database
        try:
            book = Book.objects.get(isbn=isbn)
            cache.set(cache_key, book, timeout=3600)  # Cache for 1 hour
            SearchHistory.objects.create(
                isbn=isbn,
                found=True,
                response_time_ms=int((time.time() - start_time) * 1000),
                data_source="database"
            )
            return book, None
        except Book.DoesNotExist:
            pass
        
        # Try each source
        for source_func in self.sources:
            try:
                book_data = source_func(isbn)
                if book_data:
                    # Create and save book
                    book = Book.objects.create(**book_data)
                    cache.set(cache_key, book, timeout=3600)
                    
                    SearchHistory.objects.create(
                        isbn=isbn,
                        found=True,
                        response_time_ms=int((time.time() - start_time) * 1000),
                        data_source=book_data.get('data_source', 'unknown')
                    )
                    return book, None
            except Exception as e:
                logger.error(f"Error fetching from {source_func.__name__}: {str(e)}")
                continue
        
        # Not found in any source
        SearchHistory.objects.create(
            isbn=isbn,
            found=False,
            response_time_ms=int((time.time() - start_time) * 1000)
        )
        return None, "Book not found in any source"
    
    def _fetch_from_google_books(self, isbn):
        """Fetch book data from Google Books API using API key"""
        api_key = getattr(settings, 'GOOGLE_BOOKS_API_KEY', None)
        if not api_key:
            logger.error("Google Books API key not configured")
            return None
        
        url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key={api_key}"
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get('totalItems', 0) > 0:
                item = data['items'][0]
                volume_info = item.get('volumeInfo', {})
                
                # Extract image links
                image_links = volume_info.get('imageLinks', {})
                
                book_data = {
                    'isbn': isbn,
                    'isbn_10': self._extract_isbn(volume_info.get('industryIdentifiers', []), 'ISBN_10'),
                    'isbn_13': self._extract_isbn(volume_info.get('industryIdentifiers', []), 'ISBN_13'),
                    'title': volume_info.get('title', ''),
                    'subtitle': volume_info.get('subtitle'),
                    'authors': volume_info.get('authors', []),
                    'publisher': volume_info.get('publisher'),
                    'published_date': volume_info.get('publishedDate'),
                    'description': volume_info.get('description'),
                    'page_count': volume_info.get('pageCount'),
                    'categories': volume_info.get('categories', []),
                    'language': volume_info.get('language'),
                    'thumbnail': image_links.get('thumbnail'),
                    'small_thumbnail': image_links.get('smallThumbnail'),
                    'preview_link': volume_info.get('previewLink'),
                    'info_link': volume_info.get('infoLink'),
                    'average_rating': volume_info.get('averageRating'),
                    'ratings_count': volume_info.get('ratingsCount'),
                    'maturity_rating': volume_info.get('maturityRating'),
                    'data_source': 'Google Books'
                }
                
                return book_data
        except Exception as e:
            logger.error(f"Google Books API error: {str(e)}")
        
        return None
    
    def _fetch_from_openlibrary(self, isbn):
        """Fetch book data from Open Library API"""
        url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&jscmd=data&format=json"
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            book_key = f"ISBN:{isbn}"
            if book_key in data:
                book_info = data[book_key]
                
                # Extract authors
                authors = []
                if 'authors' in book_info:
                    authors = [author.get('name', '') for author in book_info['authors']]
                
                # Extract publishers
                publishers = book_info.get('publishers', [])
                publisher = publishers[0].get('name', '') if publishers else None
                
                # Extract cover
                cover = book_info.get('cover', {})
                
                book_data = {
                    'isbn': isbn,
                    'title': book_info.get('title', ''),
                    'subtitle': book_info.get('subtitle'),
                    'authors': authors,
                    'publisher': publisher,
                    'published_date': book_info.get('publish_date'),
                    'description': book_info.get('description', {}).get('value') if isinstance(book_info.get('description'), dict) else book_info.get('description'),
                    'page_count': book_info.get('number_of_pages'),
                    'thumbnail': cover.get('medium'),
                    'small_thumbnail': cover.get('small'),
                    'preview_link': book_info.get('url'),
                    'data_source': 'Open Library'
                }
                
                return book_data
        except Exception as e:
            logger.error(f"Open Library API error: {str(e)}")
        
        return None
    
    def _fetch_from_worldcat(self, isbn):
        """Fetch book data from WorldCat (web scraping)"""
        url = f"https://www.worldcat.org/isbn/{isbn}"
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title_elem = soup.find('h1', {'id': 'title'})
            title = title_elem.get_text(strip=True) if title_elem else ''
            
            # Extract author
            author_elem = soup.find('a', {'id': 'author'})
            authors = [author_elem.get_text(strip=True)] if author_elem else []
            
            # Extract publisher and date
            publisher_elem = soup.find('td', string='Publisher:')
            publisher = ''
            published_date = ''
            if publisher_elem and publisher_elem.find_next_sibling('td'):
                pub_text = publisher_elem.find_next_sibling('td').get_text(strip=True)
                # Try to split publisher and date
                parts = pub_text.split(',')
                if len(parts) >= 2:
                    publisher = parts[0].strip()
                    published_date = parts[-1].strip()
                else:
                    publisher = pub_text
            
            if title:  # Only return if we found at least a title
                book_data = {
                    'isbn': isbn,
                    'title': title,
                    'authors': authors,
                    'publisher': publisher,
                    'published_date': published_date,
                    'data_source': 'WorldCat'
                }
                return book_data
        except Exception as e:
            logger.error(f"WorldCat scraping error: {str(e)}")
        
        return None
    
    def _extract_isbn(self, identifiers, isbn_type):
        """Extract specific ISBN type from identifiers list"""
        for identifier in identifiers:
            if identifier.get('type') == isbn_type:
                return identifier.get('identifier')
        return None