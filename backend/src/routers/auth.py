from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from sqlmodel import Session, select
from datetime import timedelta
import uuid

from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, UserRegisterResponse, UserLoginResponse, Token, ErrorResponse
from ..database import get_session
from ..utils.security import verify_password, get_password_hash, validate_email, validate_password_strength
from ..utils.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

security = HTTPBearer()

@router.post("/register", response_model=UserRegisterResponse)
def register_user(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user account.

    Args:
        user_data: User registration information (email, password)
        session: Database session for querying/creating users

    Returns:
        UserRegisterResponse with success message and user information

    Raises:
        HTTPException: If email format is invalid, password doesn't meet requirements,
                      or email already exists in the system
    """
    # Validate email format
    if not validate_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid email address"
        )

    # Validate password strength
    is_valid_password, password_message = validate_password_strength(user_data.password)
    if not is_valid_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=password_message
        )

    # Check if user already exists (with case-insensitive email matching)
    existing_user = session.exec(select(User).where(
        User.email.ilike(user_data.email)
    )).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists"
        )

    # Hash the password
    password_hash = get_password_hash(user_data.password)

    # Create new user
    user = User(
        email=user_data.email,
        password_hash=password_hash
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Return structured response
    return UserRegisterResponse(
        success=True,
        message="User registered successfully",
        user={
            "id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    )


from fastapi import APIRouter, HTTPException, Depends, status, Response
@router.post("/login", response_model=UserLoginResponse)
def login_user(
    user_data: UserLogin,
    response: Response,
    session: Session = Depends(get_session)
):
    """
    Authenticate user with email and password.

    Args:
        user_data: User login credentials (email, password)
        response: FastAPI response object to set cookies
        session: Database session for querying users

    Returns:
        UserLoginResponse with JWT access token and user information

    Raises:
        HTTPException: If credentials are invalid or user doesn't exist
    """
    # Find user by email (case-insensitive)
    user = session.exec(select(User).where(
        User.email.ilike(user_data.email)
    )).first()

    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(days=7)  # 7 days expiration
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    # Return token in response body (client-side storage preferred for SPA)
    # We'll still set the cookie for compatibility but prioritize response body
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=False,  # Changed to False so JS can read if needed
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",  # Prevents CSRF attacks
        max_age=7 * 24 * 60 * 60  # 7 days in seconds
    )

    return UserLoginResponse(
        success=True,
        access_token=access_token,
        token_type="bearer",
        user={
            "id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    )


@router.post("/logout")
def logout_user():
    """
    Logout the current user (client-side token removal).

    Returns:
        Success message confirming logout
    """
    # In a stateless JWT system, logout is typically handled client-side
    # by removing the token from local storage/cookies
    return {
        "success": True,
        "message": "Successfully logged out"
    }