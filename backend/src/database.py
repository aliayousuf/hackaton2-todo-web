from sqlmodel import create_engine, Session
from sqlalchemy import event
from sqlalchemy.pool import QueuePool
import os
from typing import Generator
from contextlib import contextmanager
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/todo_db")

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=False  # Set to True for SQL query logging
)

def get_session() -> Generator[Session, None, None]:
    """
    Get database session for dependency injection.

    Yields:
        Session: Database session for use in API endpoints
    """
    with Session(engine) as session:
        yield session

@contextmanager
def get_db_session():
    """
    Context manager for database sessions.

    Provides a transactional scope around a series of operations.
    """
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

# Optional: Add connection event listeners for monitoring
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Set database-specific pragmas when connecting."""
    pass  # Currently no specific pragmas needed