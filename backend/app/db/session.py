from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..core.config import settings # Import settings to get DATABASE_URL

# Create SQLAlchemy engine
# The connect_args are specific to SQLite. For MySQL, these are not typically needed
# unless you have specific SSL requirements or other connection parameters.
# For MySQL with mysqlconnector, the URL should be like:
# 'mysql+mysqlconnector://user:password@host:port/dbname'
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True # Good practice to ensure connections are live
    # For production, you might want to configure pool_size, max_overflow, etc.
    # e.g., pool_size=10, max_overflow=20
)

# Create a SessionLocal class, which will be a factory for new Session objects
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    FastAPI dependency that provides a SQLAlchemy database session.
    It ensures the session is closed after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Optional: A function to create tables (useful for initial setup or testing)
# from .base import Base # Import your Base
# def init_db():
#     # This will create all tables defined that inherit from Base
#     # Be cautious using this in production if you use migrations (like Alembic)
#     Base.metadata.create_all(bind=engine)
