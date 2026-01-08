from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"
    """
    User model representing an authenticated account in the system.

    Attributes:
        id: Unique identifier for the user (UUID)
        email: User's email address (unique, indexed)
        password_hash: Hashed password (using bcrypt)
        created_at: Account creation timestamp
        updated_at: Last update timestamp
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False, max_length=255)
    password_hash: str = Field(nullable=False, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"

    def __str__(self):
        return f"User(email={self.email})"