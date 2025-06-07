# SQLAlchemy ORM models (maps to database tables)
from sqlalchemy import (
    Column, Integer, String, Boolean, Text, ForeignKey, DateTime, JSON, Date,
    Enum as SAEnum, Numeric, BigInteger
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func # For server_default and onupdate

from .base import Base # Import Base from base.py

# Enum definitions (must be unique if you have multiple Enums with same values but different contexts)
book_status_enum = SAEnum(
    'Draft', 'SubmittedForAIReview', 'AIReviewInProgress', 'AIReviewCompleted',
    'Published', 'Unpublished', 'Rejected', 'AnonymousProcessing',
    name='book_status_enum'
)

class Book(Base):
    __tablename__ = "Books"

    BookID = Column(BigInteger, primary_key=True, autoincrement=True) # MySQL BIGINT UNSIGNED
    Title = Column(String(255), nullable=False)
    AuthorID = Column(BigInteger, ForeignKey("Authors.AuthorID", ondelete="SET NULL"), nullable=True) # MySQL BIGINT UNSIGNED, now NULLABLE
    PublisherID = Column(BigInteger, ForeignKey("Publishers.PublisherID", ondelete="SET NULL"), nullable=True) # MySQL BIGINT UNSIGNED
    GenreID = Column(Integer, ForeignKey("Genres.GenreID", ondelete="SET NULL"), nullable=True) # MySQL INT UNSIGNED
    LanguageID = Column(Integer, ForeignKey("Languages.LanguageID", ondelete="SET NULL"), nullable=True) # MySQL INT UNSIGNED
    
    Status = Column(book_status_enum, default='Draft')
    
    CoverImageURL = Column(Text, nullable=True)
    Blurb = Column(Text, nullable=True)
    ISBN = Column(String(20), unique=True, nullable=True)
    PublicationDate = Column(Date, nullable=True)
    PageCount = Column(Integer, nullable=True)
    TargetAudience = Column(Text, nullable=True)
    ManuscriptURL = Column(Text, nullable=True) # Temporary link
    
    AverageReaderRating = Column(Numeric(3, 2), default=0.00)
    ReaderReviewCount = Column(Integer, default=0)
    PlagiarismScore = Column(Numeric(5, 2), nullable=True) # Storing overall score
    
    HasAuthorRespondedToAIReview = Column(Boolean, default=False)
    
    SubmittedForAIReviewAt = Column(DateTime, nullable=True)
    AIReviewCompletedAt = Column(DateTime, nullable=True)
    PublishedAt = Column(DateTime, nullable=True)
    
    CreatedAt = Column(DateTime, server_default=func.now())
    UpdatedAt = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    # author = relationship("Author", back_populates="books") # Placeholder for Author model
    # publisher = relationship("Publisher", back_populates="books") # Placeholder for Publisher model
    # genre = relationship("Genre", back_populates="books") # Placeholder for Genre model
    # language = relationship("Language", back_populates="books") # Placeholder for Language model
    
    ai_reviews = relationship("AIReview", back_populates="book", cascade="all, delete-orphan")
    # reader_reviews = relationship("ReaderReview", back_populates="book") # Placeholder
    # keywords = relationship("BookKeyword", back_populates="book") # Placeholder
    # purchase_links = relationship("BookPurchaseLink", back_populates="book") # Placeholder
    # checklist = relationship("AuthorProcessChecklist", back_populates="book", uselist=False) # Placeholder

class AIReview(Base):
    __tablename__ = "AIReviews"

    AIReviewID = Column(BigInteger, primary_key=True, autoincrement=True) # MySQL BIGINT UNSIGNED
    BookID = Column(BigInteger, ForeignKey("Books.BookID", ondelete="CASCADE"), nullable=False)
    
    ReviewDate = Column(DateTime, server_default=func.now())
    AIModelUsed = Column(String(100), nullable=True)
    ProcessingTimeSeconds = Column(Integer, nullable=True)
    OverallScore = Column(Numeric(4, 2), nullable=True) # e.g., 85.50
    
    SentimentAnalysis = Column(JSON, nullable=True)
    WritingStyleAnalysis = Column(JSON, nullable=True)
    NarrativeAnalysis = Column(JSON, nullable=True)
    PlagiarismDetails = Column(JSON, nullable=True) # Storing details, score is also in Books
    GrammarAndSpellCheck = Column(JSON, nullable=True)
    MarketFitAnalysis = Column(JSON, nullable=True)
    
    GeneratedFullReview = Column(Text, nullable=True)
    GeneratedSummary = Column(Text, nullable=True)
    Strengths = Column(JSON, nullable=True)
    Weaknesses = Column(JSON, nullable=True)
    SuggestionsForImprovement = Column(JSON, nullable=True)
    
    CreatedAt = Column(DateTime, server_default=func.now())
    UpdatedAt = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationship
    book = relationship("Book", back_populates="ai_reviews")

# TODO: Define other models: User, Author, Publisher, Genre, Language, Keyword, BookKeyword, etc.
# Ensure to define relationships (back_populates) in those models as well.
