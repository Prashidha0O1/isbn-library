from rest_framework import serializers
from .models import Book, SearchHistory

class BookSerializer(serializers.ModelSerializer):
    """Serializer for Book model"""
    
    class Meta:
        model = Book
        fields = [
            'id', 'isbn', 'isbn_10', 'isbn_13', 'title', 'subtitle',
            'authors', 'publisher', 'published_date', 'description',
            'page_count', 'categories', 'language', 'thumbnail',
            'small_thumbnail', 'preview_link', 'info_link',
            'average_rating', 'ratings_count', 'maturity_rating',
            'data_source', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class BookSearchResponseSerializer(serializers.Serializer):
    """Serializer for book search responses"""
    success = serializers.BooleanField()
    message = serializers.CharField(required=False, allow_blank=True)
    data = BookSerializer(required=False, allow_null=True)
    search_time_ms = serializers.IntegerField(required=False)

class ISBNValidationSerializer(serializers.Serializer):
    """Serializer for ISBN validation requests"""
    isbn = serializers.CharField(max_length=20, required=True)
    
    def validate_isbn(self, value):
        """Validate ISBN format"""
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("ISBN cannot be empty")
        
        # Remove common separators and whitespace
        clean_isbn = ''.join(value.split()).replace('-', '').replace(' ', '')
        
        if len(clean_isbn) not in [10, 13]:
            raise serializers.ValidationError("ISBN must be 10 or 13 digits long")
        
        return clean_isbn

class SearchHistorySerializer(serializers.ModelSerializer):
    """Serializer for SearchHistory model"""
    
    class Meta:
        model = SearchHistory
        fields = [
            'id', 'isbn', 'search_time', 'found', 'response_time_ms', 'data_source'
        ]
        read_only_fields = ['id', 'search_time']