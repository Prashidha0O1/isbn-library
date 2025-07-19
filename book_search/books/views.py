import time
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.db import models
import json

from .models import Book, SearchHistory
from .serializers import (
    BookSerializer, 
    BookSearchResponseSerializer, 
    ISBNValidationSerializer,
    SearchHistorySerializer
)
from .services import ISBNService

# Initialize the service
isbn_service = ISBNService()

@api_view(['POST'])
@permission_classes([AllowAny])
def search_book(request):
    """
    Search for a book by ISBN
    
    POST /api/books/search/
    {
        "isbn": "9780134685991"
    }
    """
    start_time = time.time()
    
    # Validate request data
    serializer = ISBNValidationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid request data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    isbn = serializer.validated_data['isbn']
    
    # Search for book
    book, error_message = isbn_service.search_book(isbn)
    
    search_time_ms = int((time.time() - start_time) * 1000)
    
    if book:
        book_serializer = BookSerializer(book)
        response_data = {
            'success': True,
            'data': book_serializer.data,
            'search_time_ms': search_time_ms,
            'message': 'Book found successfully'
        }
        return Response(response_data, status=status.HTTP_200_OK)
    else:
        response_data = {
            'success': False,
            'message': error_message or 'Book not found',
            'search_time_ms': search_time_ms
        }
        return Response(response_data, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def validate_isbn(request):
    """
    Validate an ISBN without searching
    
    POST /api/books/validate/
    {
        "isbn": "9780134685991"
    }
    """
    serializer = ISBNValidationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid request data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    isbn = serializer.validated_data['isbn']
    is_valid = isbn_service.validate_isbn(isbn)
    
    return Response({
        'success': True,
        'valid': is_valid,
        'isbn': isbn_service.normalize_isbn(isbn),
        'message': 'ISBN is valid' if is_valid else 'Invalid ISBN format'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_book_by_isbn(request, isbn):
    """
    Get a specific book by ISBN
    
    GET /api/books/{isbn}/
    """
    normalized_isbn = isbn_service.normalize_isbn(isbn)
    try:
        book = Book.objects.get(isbn=normalized_isbn)
    except Book.DoesNotExist:
        # Try to fetch from external sources if not found in DB
        book, error_message = isbn_service.search_book(normalized_isbn)
        if not book:
            return Response({
                'success': False,
                'message': error_message or 'Book not found'
            }, status=status.HTTP_404_NOT_FOUND)
    serializer = BookSerializer(book)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def list_recent_books(request):
    """
    Get recently searched books
    
    GET /api/books/recent/
    """
    limit = request.GET.get('limit', 20)
    try:
        limit = int(limit)
        limit = min(limit, 100)  # Max 100 books
    except ValueError:
        limit = 20
    
    books = Book.objects.all()[:limit]
    serializer = BookSerializer(books, many=True)
    
    return Response({
        'success': True,
        'count': len(books),
        'data': serializer.data
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def search_history(request):
    """
    Get search history stats
    
    GET /api/books/history/
    """
    limit = request.GET.get('limit', 50)
    try:
        limit = int(limit)
        limit = min(limit, 200)  # Max 200 entries
    except ValueError:
        limit = 50
    
    history = SearchHistory.objects.all()[:limit]
    serializer = SearchHistorySerializer(history, many=True)
    
    # Calculate some stats
    total_searches = SearchHistory.objects.count()
    successful_searches = SearchHistory.objects.filter(found=True).count()
    success_rate = (successful_searches / total_searches * 100) if total_searches > 0 else 0
    
    # Average response time
    avg_response_time = SearchHistory.objects.exclude(
        response_time_ms__isnull=True
    ).aggregate(
        avg_time=models.Avg('response_time_ms')
    )['avg_time'] or 0
    
    return Response({
        'success': True,
        'stats': {
            'total_searches': total_searches,
            'successful_searches': successful_searches,
            'success_rate': round(success_rate, 2),
            'average_response_time_ms': round(avg_response_time, 2)
        },
        'history': serializer.data
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    API health check endpoint
    
    GET /api/health/
    """
    return Response({
        'status': 'healthy',
        'timestamp': time.time(),
        'services': {
            'database': 'connected',
            'cache': 'available'
        }
    })

# Error handlers
@api_view(['GET', 'POST'])
def not_found(request):
    return Response({
        'success': False,
        'message': 'Endpoint not found',
        'available_endpoints': [
            'POST /api/books/search/',
            'POST /api/books/validate/',
            'GET /api/books/recent/',
            'GET /api/books/history/',
            'GET /api/books/{isbn}/',
            'GET /api/health/'
        ]
    }, status=status.HTTP_404_NOT_FOUND)
