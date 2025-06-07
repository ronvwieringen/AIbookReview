# Application configuration settings
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AIbookReview API"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "mysql+mysqlconnector://user:password@host:port/dbname"

    # Security
    SECRET_KEY: str = "your-secret-key-here"  # CHANGE THIS!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Google Gemini
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
