from passlib.context import CryptContext
from typing import Union
import re
import hashlib

# Initialize context with pbkdf2 as primary to avoid bcrypt issues
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Previously hashed password to compare against

    Returns:
        True if passwords match, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate a bcrypt hash for a plain text password.

    Args:
        password: Plain text password to hash

    Returns:
        Hashed password string
    """
    # Truncate password to 72 bytes to avoid bcrypt limitation
    truncated_password = password[:72] if len(password) > 72 else password
    return pwd_context.hash(truncated_password)


def validate_email(email: str) -> bool:
    """
    Validate email format using a regular expression.

    Args:
        email: Email string to validate

    Returns:
        True if email format is valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password_strength(password: str) -> tuple[bool, str]:
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
        return False, "Password must be at least 8 characters long"

    # Additional checks could be added here:
    # - At least one uppercase letter
    # - At least one lowercase letter
    # - At least one digit
    # - At least one special character

    return True, "Password meets requirements"


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


def validate_task_title(title: str) -> tuple[bool, str]:
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


def validate_task_description(description: str = None) -> tuple[bool, str]:
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


def validate_user_input(user_input: str, min_length: int = 1, max_length: int = 1000) -> tuple[bool, str]:
    """
    Generic user input validation.

    Args:
        user_input: Input string to validate
        min_length: Minimum allowed length (default 1)
        max_length: Maximum allowed length (default 1000)

    Returns:
        Tuple of (is_valid: bool, message: str)
    """
    if user_input is None:
        return False, "Input cannot be null"

    if len(user_input) < min_length:
        return False, f"Input must be at least {min_length} characters"

    if len(user_input) > max_length:
        return False, f"Input must be no more than {max_length} characters"

    return True, "Input is valid"


def hash_and_validate_password(password: str) -> tuple[Union[str, None], str]:
    """
    Validate and hash a password in a single operation.

    Args:
        password: Plain text password to validate and hash

    Returns:
        Tuple of (hashed_password: str or None, message: str)
        - hashed_password: The hashed password if valid, None if invalid
        - message: Explanation of the result
    """
    is_valid, message = validate_password_strength(password)

    if not is_valid:
        return None, message

    hashed = get_password_hash(password)
    return hashed, "Password is valid and hashed successfully"


def validate_and_sanitize_input(input_str: str, max_length: int = 1000) -> tuple[Union[str, None], str]:
    """
    Validate and sanitize user input in a single operation.

    Args:
        input_str: Input string to validate and sanitize
        max_length: Maximum allowed length (default 1000)

    Returns:
        Tuple of (sanitized_input: str or None, message: str)
        - sanitized_input: The sanitized input if valid, None if invalid
        - message: Explanation of the result
    """
    if input_str is None:
        return None, "Input cannot be null"

    if len(input_str) > max_length:
        return None, f"Input exceeds maximum length of {max_length} characters"

    # Fixed the variable name from 'input_str' to 'input_str' and 'sanitize_input' to 'sanitize_input'
    sanitized = sanitize_input(input_str)
    return sanitized, "Input is valid and sanitized"