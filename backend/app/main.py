# Main FastAPI application
from fastapi import FastAPI
from app.api.v1.api import api_router_v1 # Import the v1 API router
from app.core.config import settings # For project settings

app = FastAPI(
    title=settings.PROJECT_NAME, # Using settings for project name
    description="API for AIbookReview platform, enabling manuscript uploads and AI-driven reviews.",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json" # Configure OpenAPI URL
)

# Include the V1 API router
app.include_router(api_router_v1, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API. Visit {settings.API_V1_STR}/docs for API documentation."}

# Optional: Add other global configurations, middleware, exception handlers, etc.
# For example, CORS middleware:
# from fastapi.middleware.cors import CORSMiddleware
# if settings.BACKEND_CORS_ORIGINS: # Ensure BACKEND_CORS_ORIGINS is in your Settings
#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
#         allow_credentials=True,
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )

