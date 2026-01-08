from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserRegister(BaseModel):
    """
    Schema for user registration request.

    Attributes:
        email: User's email address
        password: User's password (will be validated for strength)
    """
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }

class UserLogin(BaseModel):
    """
    Schema for user login request.

    Attributes:
        email: User's email address
        password: User's password
    """
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }

class Token(BaseModel):
    """
    Schema for authentication token response.

    Attributes:
        access_token: JWT access token
        token_type: Type of token (usually "bearer")
    """
    access_token: str
    token_type: str

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }

class TokenData(BaseModel):
    """
    Schema for token payload data.

    Attributes:
        user_id: UUID of the authenticated user
        email: Email of the authenticated user
    """
    user_id: uuid.UUID
    email: str

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "user@example.com"
            }
        }

class UserResponse(BaseModel):
    """
    Schema for user response without sensitive data.

    Attributes:
        id: Unique identifier for the user
        email: User's email address
        created_at: Account creation timestamp
        updated_at: Last update timestamp
    """
    id: uuid.UUID
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "user@example.com",
                "created_at": "2023-01-01T12:00:00Z",
                "updated_at": "2023-01-01T12:00:00Z"
            }
        }

class UserUpdate(BaseModel):
    """
    Schema for updating user information.

    Attributes:
        email: Optional new email address
        password: Optional new password
    """
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "email": "newemail@example.com",
                "password": "newsecurepassword123"
            }
        }