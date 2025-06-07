# Pydantic models (schemas) for API request and response validation
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime, date

# --- Existing User Schemas (slightly refactored for consistency) ---
class UserBase(BaseModel):
    email: EmailStr
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    role: str # TODO: Use Enum for roles, e.g., from ..core.enums import UserRole

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int # Assuming UserID from model maps to id
    # Add other fields from User model as needed for responses

    class Config:
        from_attributes = True # For Pydantic v2+ (was orm_mode)

# --- AIReview Schemas ---
class AIReviewBase(BaseModel):
    AIModelUsed: Optional[str] = None
    ProcessingTimeSeconds: Optional[int] = None
    OverallScore: Optional[float] = Field(default=None, ge=0, le=100)
    SentimentAnalysis: Optional[Dict] = None
    WritingStyleAnalysis: Optional[Dict] = None
    NarrativeAnalysis: Optional[Dict] = None
    PlagiarismDetails: Optional[Dict] = None # Detailed findings
    GrammarAndSpellCheck: Optional[Dict] = None
    MarketFitAnalysis: Optional[Dict] = None
    GeneratedFullReview: Optional[str] = None
    GeneratedSummary: Optional[str] = None
    Strengths: Optional[List[str]] = None
    Weaknesses: Optional[List[str]] = None
    SuggestionsForImprovement: Optional[List[str]] = None

class AIReviewCreate(AIReviewBase):
    # BookID will be linked during the CRUD operation, not part of this creation schema directly
    # as this schema represents data coming from the AI service.
    pass

class AIReview(AIReviewBase):
    AIReviewID: int
    BookID: int
    ReviewDate: datetime
    CreatedAt: datetime
    UpdatedAt: datetime

    class Config:
        from_attributes = True

# --- Book Schemas ---
class BookBase(BaseModel):
    Title: Optional[str] = None # Will be populated by AI
    Blurb: Optional[str] = None # Will be populated by AI
    CoverImageURL: Optional[str] = None
    ISBN: Optional[str] = None
    PublicationDate: Optional[date] = None
    PageCount: Optional[int] = None
    TargetAudience: Optional[str] = None
    ManuscriptURL: Optional[str] = None # Temp URL of uploaded file, cleared after processing
    Status: Optional[str] = 'AnonymousProcessing'
    PlagiarismScore: Optional[float] = Field(default=None, ge=0, le=100) # Overall score
    # GenreID, LanguageID, PublisherID can be added if needed for creation/update directly
    # For responses, we might prefer nested objects or specific string names.

class BookCreate(BookBase):
    Title: str # Making Title mandatory after AI extraction for a valid book record
    # Other fields are populated by AI or have defaults

class BookUpdate(BaseModel): # Schema for updating a book, e.g., after user claims it
    Title: Optional[str] = None
    AuthorID: Optional[int] = None
    PublisherID: Optional[int] = None
    GenreID: Optional[int] = None
    LanguageID: Optional[int] = None
    Status: Optional[str] = None
    CoverImageURL: Optional[str] = None
    Blurb: Optional[str] = None
    ISBN: Optional[str] = None
    PublicationDate: Optional[date] = None
    PageCount: Optional[int] = None
    TargetAudience: Optional[str] = None
    HasAuthorRespondedToAIReview: Optional[bool] = None
    # Add other fields that a user/admin might update

class Book(BookBase): # This will serve as the main response for a processed manuscript
    BookID: int
    AuthorID: Optional[int] = None # Null for anonymous, populated when claimed
    # PublisherID: Optional[int] = None # Expose if needed
    # GenreID: Optional[int] = None     # Expose if needed
    # LanguageID: Optional[int] = None  # Expose if needed
    CreatedAt: datetime
    UpdatedAt: datetime
    ai_reviews: List[AIReview] = [] # Nests the AI review(s)

    class Config:
        from_attributes = True

# Ensure all forward references are resolved. Pydantic v2 handles this better.
# If needed for Pydantic v1, call ModelName.update_forward_refs() for each model.
# For Pydantic v2, you can use ModelName.model_rebuild() if explicit rebuilding is necessary.
