from django.db import models
from django.utils import timezone

class Book(models.Model):
    isbn = models.CharField(max_length=20, unique=True, db_index=True)
    isbn_10 = models.CharField(max_length=10, null=True, blank=True)
    isbn_13 = models.CharField(max_length=17, null=True, blank=True)
    title = models.CharField(max_length=500)
    subtitle = models.CharField(max_length=500, null=True, blank=True)
    authors = models.JSONField(default=list)  # List of author names
    publisher = models.CharField(max_length=300, null=True, blank=True)
    published_date = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    page_count = models.IntegerField(null=True, blank=True)
    categories = models.JSONField(default=list)  # List of categories
    language = models.CharField(max_length=10, null=True, blank=True)
    thumbnail = models.URLField(null=True, blank=True)
    small_thumbnail = models.URLField(null=True, blank=True)
    preview_link = models.URLField(null=True, blank=True)
    info_link = models.URLField(null=True, blank=True)
    
    # Additional metadata
    average_rating = models.FloatField(null=True, blank=True)
    ratings_count = models.IntegerField(null=True, blank=True)
    maturity_rating = models.CharField(max_length=50, null=True, blank=True)
    
    # Tracking fields
    data_source = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.isbn})"

class SearchHistory(models.Model):
    isbn = models.CharField(max_length=20)
    search_time = models.DateTimeField(auto_now_add=True)
    found = models.BooleanField(default=False)
    response_time_ms = models.IntegerField(null=True, blank=True)
    data_source = models.CharField(max_length=100, null=True, blank=True)
    
    class Meta:
        ordering = ['-search_time']
        verbose_name_plural = "Search histories"
    
    def __str__(self):
        return f"Search for {self.isbn} at {self.search_time}"