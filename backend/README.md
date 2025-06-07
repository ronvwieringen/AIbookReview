# AIbookReview Backend

This directory contains the source code for the AIbookReview platform's backend API, built with Python and FastAPI.

## Project Structure

-   `app/`: Main application package.
    -   `main.py`: FastAPI application instance and startup.
    -   `api/`: API endpoint routers.
        -   `v1/`: Version 1 of the API.
            -   `endpoints/`: Specific endpoint modules (users, books, etc.).
            -   `schemas.py`: Pydantic models for request/response validation.
    -   `core/`: Core logic, configuration, and security utilities.
        -   `config.py`: Application settings.
        -   `security.py`: Password hashing, JWT handling.
    -   `crud/`: Database Create, Read, Update, Delete operations.
    -   `db/`: Database setup, session management, and ORM models.
        -   `database.py`: Engine, session, and DB dependency.
        -   `models.py`: SQLAlchemy ORM models.
        -   `base.py`: Base for ORM models.
    -   `services/`: Business logic and interactions with external services (e.g., Google Gemini).
-   `tests/`: Unit and integration tests.
-   `.env.example`: Example environment variables file. Copy to `.env` and configure.
-   `requirements.txt`: Python dependencies.

## Setup

1.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure environment variables:**
    Copy `.env.example` to `.env` and update the variables with your local settings (database credentials, secret key, API keys, etc.).
    ```bash
    cp .env.example .env
    ```
4.  **Database Setup:**
    Ensure your MySQL database server is running and you have created the `aibookreview_db` database using the `schema_mysql.sql` script located in the project's `database` directory.

## Running the Application

To run the development server (with auto-reload):

```bash
uvicorn app.main:app --reload
```

The API will typically be available at `http://127.0.0.1:8000`.
Interactive API documentation (Swagger UI) will be at `http://127.0.0.1:8000/docs`.
Alternative API documentation (ReDoc) will be at `http://127.0.0.1:8000/redoc`.
