"""
Validation utilities for the Todo API application.

This module contains functions for validating various input types
and ensuring data integrity across the application.
"""

import re
from typing import Tuple
from sqlmodel import Session
from ..models.user import User
from .security import validate_email


def validate_email_format(email: str) -> Tuple[bool, str]:
    """
    Validate email format using a regular expression.

    Args:
        email: Email string to validate

    Returns:
        Tuple of (is_valid: bool, message: str)
        - is_valid: True if email format is valid, False otherwise
        - message: Explanation of validation result
    """
    return validate_email(email), "Email format is valid" if validate_email(email) else "Invalid email format"


def validate_password_strength(password: str) -> Tuple[bool, str]:
    """
    Validate password strength requirements.

    Args:
        password: Password string to validate

    Returns:
        Tuple of (is_valid: bool, message: str)
        - is_valid: True if password meets requirements, False otherwise
        - message: Explanation of validation result
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters"

    # Check for at least one uppercase letter
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"

    # Check for at least one lowercase letter
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"

    # Check for at least one digit
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"

    # Check for at least one special character
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"

    return True, "Password meets requirements"


def validate_task_title(title: str) -> Tuple[bool, str]:
    """
    Validate task title length and content.

    Args:
        title: Task title to validate

    Returns:
        Tuple of (is_valid: bool, message: str)
    """
    if not title or len(title.strip()) == 0:
        return False, "Title is required"

    if len(title) > 200:
        return False, "Title must be 200 characters or less"

    if len(title.strip()) == 0:
        return False, "Title cannot be empty or just whitespace"

    return True, "Title is valid"


def validate_task_description(description: str = None) -> Tuple[bool, str]:
    """
    Validate task description length and content.

    Args:
        description: Task description to validate (can be None)

    Returns:
        Tuple of (is_valid: bool, message: str)
    """
    if description is None:
        return True, "Description is valid (null)"

    if len(description) > 1000:
        return False, "Description must be 1000 characters or less"

    return True, "Description is valid"


def validate_unique_email(session: Session, email: str, exclude_user_id: str = None) -> Tuple[bool, str]:
    """
    Validate that an email is unique in the database.

    Args:
        session: Database session
        email: Email to check for uniqueness
        exclude_user_id: Optional user ID to exclude from check (for updates)

    Returns:
        Tuple of (is_unique: bool, message: str)
    """
    from sqlmodel import select

    query = select(User).where(User.email.ilike(email))
    if exclude_user_id:
        query = query.where(User.id != exclude_user_id)

    existing_user = session.exec(query).first()

    if existing_user:
        return False, "Email already exists"

    return True, "Email is unique"


def validate_user_exists(session: Session, user_id: str) -> Tuple[bool, str]:
    """
    Validate that a user exists in the database.

    Args:
        session: Database session
        user_id: User ID to check

    Returns:
        Tuple of (exists: bool, message: str)
    """
    from sqlmodel import select

    user = session.get(User, user_id)
    if not user:
        return False, "User not found"

    return True, "User exists"


def sanitize_input(input_str: str) -> str:
    """
    Sanitize user input to prevent XSS and other injection attacks.

    Args:
        input_str: User input string to sanitize

    Returns:
        Sanitized string with potentially dangerous content removed/escaped
    """
    if input_str is None:
        return None

    # Remove potentially dangerous characters/entities
    sanitized = input_str.strip()

    # Prevent basic XSS attempts by escaping common attack vectors
    sanitized = sanitized.replace('<', '&lt;').replace('>', '&gt;')
    sanitized = sanitized.replace('"', '&quot;').replace("'", '&#x27;')
    sanitized = sanitized.replace('/', '&#x2F;')

    return sanitized


def validate_uuid_format(uuid_string: str) -> Tuple[bool, str]:
    """
    Validate that a string is in valid UUID format.

    Args:
        uuid_string: String to validate as UUID

    Returns:
        Tuple of (is_valid: bool, message: str)
    """
    try:
        import uuid
        uuid.UUID(uuid_string)
        return True, "Valid UUID format"
    except ValueError:
        return False, "Invalid UUID format"