from sqlalchemy.orm import Session
from typing import Optional, List

from ..db import models
from ..api.v1 import schemas

def create_ai_review(db: Session, ai_review: schemas.AIReviewCreate, book_id: int) -> models.AIReview:
    """
    Create a new AI Review record and associate it with a book.
    """
    db_ai_review = models.AIReview(
        **ai_review.model_dump(exclude_unset=True), # Use model_dump for Pydantic v2+
        BookID=book_id
    )
    db.add(db_ai_review)
    db.commit()
    db.refresh(db_ai_review)
    return db_ai_review

def get_ai_review(db: Session, ai_review_id: int) -> Optional[models.AIReview]:
    """
    Retrieve an AI Review by its ID.
    """
    return db.query(models.AIReview).filter(models.AIReview.AIReviewID == ai_review_id).first()

def get_ai_reviews_for_book(db: Session, book_id: int) -> List[models.AIReview]:
    """
    Retrieve all AI Reviews for a specific book.
    """
    return db.query(models.AIReview).filter(models.AIReview.BookID == book_id).all()

# TODO: Add functions for:
# - update_ai_review (if AI reviews can be updated post-creation)
# - delete_ai_review (if needed)
