# CRUD operations for Book model
from sqlalchemy.orm import Session
from typing import Optional
from ..db import models
from ..api.v1 import schemas # Assuming schemas are in api.v1.schemas

def create_book(db: Session, book: schemas.BookCreate) -> models.Book:
    """
    Create a new book record in the database.
    AuthorID will be NULL for anonymous uploads initially.
    """
    db_book = models.Book(
        Title=book.Title,
        # AuthorID is intentionally left out here to be NULL by default
        # or it could be explicitly set to None if the model default isn't NULL
        Status=book.Status or 'AnonymousProcessing', # Default to AnonymousProcessing if not provided
        Blurb=book.Blurb,
        CoverImageURL=book.CoverImageURL,
        ISBN=book.ISBN,
        PublicationDate=book.PublicationDate,
        PageCount=book.PageCount,
        TargetAudience=book.TargetAudience,
        ManuscriptURL=book.ManuscriptURL, # Store temp URL
        PlagiarismScore=book.PlagiarismScore
        # Other fields from schemas.BookCreate can be added here
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def get_book(db: Session, book_id: int) -> Optional[models.Book]:
    """
    Retrieve a book by its ID.
    """
    return db.query(models.Book).filter(models.Book.BookID == book_id).first()

# TODO: Add functions for:
# - get_books (with pagination, filtering by status, author_id, etc.)
# - update_book (e.g., to claim a book by setting AuthorID, or general updates)
# - delete_book (if applicable)
