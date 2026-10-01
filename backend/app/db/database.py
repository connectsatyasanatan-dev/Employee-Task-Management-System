from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


# Locate the backend folder regardless of the terminal's current directory.
BACKEND_DIR = Path(__file__).resolve().parents[2]

# SQLite database file.
DATABASE_URL = f"sqlite:///{BACKEND_DIR / 'task_management.db'}"


# Create the SQLAlchemy engine.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


# Base class for our future database models.
class Base(DeclarativeBase):
    pass


# Factory that creates database sessions.
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


# FastAPI dependency: provide a session and close it afterward.
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close() 