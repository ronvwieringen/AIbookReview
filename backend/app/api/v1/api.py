from fastapi import APIRouter

from .endpoints import manuscripts
# from .endpoints import users # Example: if you have a users router

api_router_v1 = APIRouter()

api_router_v1.include_router(manuscripts.router, prefix="/manuscripts", tags=["Manuscripts"])
# api_router_v1.include_router(users.router, prefix="/users", tags=["Users"]) # Example

# Add other endpoint routers here
