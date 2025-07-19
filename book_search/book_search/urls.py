from django.urls import path
from . import views

urlpatterns = [
    path("books/search/",         views.search_book,         name="search_book"),
    path("books/validate/",       views.validate_isbn,       name="validate_isbn"),
    path("books/recent/",         views.list_recent_books,   name="recent_books"),
    path("books/history/",        views.search_history,      name="search_history"),
    path("books/<str:isbn>/",     views.get_book_by_isbn,    name="book_detail"),
    path("health/",               views.health_check,        name="health_check"),
]