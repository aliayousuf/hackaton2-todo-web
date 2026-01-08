import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch, MagicMock
from sqlmodel import Session, select
from datetime import datetime
import uuid

from src.main import create_app
from src.models.user import User
from src.schemas.user import UserCreate


class TestAuthRegistration:
    """Unit tests for user registration endpoint."""

    def setup_method(self):
        """Set up test client for each test."""
        app = create_app()
        self.client = TestClient(app)

        # Mock session
        self.mock_session = Mock(spec=Session)

        # Create a mock user
        self.mock_user = User(
            id=uuid.uuid4(),
            email="test@example.com",
            password_hash="$2b$12$mocked_hashed_password",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

    def test_register_user_success(self):
        """Test successful user registration."""
        # Arrange
        user_data = {
            "email": "newuser@example.com",
            "password": "SecurePassword123!"
        }

        # Mock the database operations
        with patch('src.routers.auth.get_session') as mock_get_session:
            mock_get_session.return_value.__enter__.return_value = self.mock_session
            self.mock_session.exec.return_value.first.return_value = None  # No existing user
            self.mock_session.add.return_value = None
            self.mock_session.commit.return_value = None
            self.mock_session.refresh.return_value = None

            # Mock the user creation
            created_user = User(
                id=uuid.uuid4(),
                email=user_data["email"],
                password_hash="$2b$12$mocked_hashed_password",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )

            # Act
            response = self.client.post("/api/auth/register", json=user_data)

            # Assert
            assert response.status_code == 200
            response_data = response.json()
            assert response_data["success"] is True
            assert "User registered successfully" in response_data["message"]
            assert response_data["user"]["email"] == user_data["email"]

    def test_register_user_invalid_email(self):
        """Test registration with invalid email format."""
        # Arrange
        user_data = {
            "email": "invalid-email",
            "password": "SecurePassword123!"
        }

        # Act
        response = self.client.post("/api/auth/register", json=user_data)

        # Assert
        assert response.status_code == 400
        response_data = response.json()
        assert "valid email address" in response_data["detail"]

    def test_register_user_weak_password(self):
        """Test registration with weak password."""
        # Arrange
        user_data = {
            "email": "test@example.com",
            "password": "weak"
        }

        # Act
        response = self.client.post("/api/auth/register", json=user_data)

        # Assert
        assert response.status_code == 400
        response_data = response.json()
        assert "at least 8 characters" in response_data["detail"]

    def test_register_user_existing_email(self):
        """Test registration with existing email."""
        # Arrange
        user_data = {
            "email": "existing@example.com",
            "password": "SecurePassword123!"
        }

        # Mock an existing user
        existing_user = User(
            id=uuid.uuid4(),
            email=user_data["email"],
            password_hash="$2b$12$mocked_hashed_password",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        with patch('src.routers.auth.get_session') as mock_get_session:
            mock_get_session.return_value.__enter__.return_value = self.mock_session
            self.mock_session.exec.return_value.first.return_value = existing_user

            # Act
            response = self.client.post("/api/auth/register", json=user_data)

            # Assert
            assert response.status_code == 409
            response_data = response.json()
            assert "An account with this email already exists" in response_data["detail"]

    def test_register_user_missing_email(self):
        """Test registration with missing email."""
        # Arrange
        user_data = {
            "password": "SecurePassword123!"
        }

        # Act
        response = self.client.post("/api/auth/register", json=user_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_register_user_missing_password(self):
        """Test registration with missing password."""
        # Arrange
        user_data = {
            "email": "test@example.com"
        }

        # Act
        response = self.client.post("/api/auth/register", json=user_data)

        # Assert
        assert response.status_code == 422  # Validation error


class TestAuthLogin:
    """Unit tests for user login endpoint."""

    def setup_method(self):
        """Set up test client for each test."""
        app = create_app()
        self.client = TestClient(app)

        # Mock session
        self.mock_session = Mock(spec=Session)

        # Create a mock user
        self.mock_user = User(
            id=uuid.uuid4(),
            email="test@example.com",
            password_hash="$2b$12$mocked_hashed_password",  # This is a valid bcrypt hash
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

    def test_login_user_success(self):
        """Test successful user login."""
        # Arrange
        login_data = {
            "email": "test@example.com",
            "password": "SecurePassword123!"
        }

        with patch('src.routers.auth.get_session') as mock_get_session:
            mock_get_session.return_value.__enter__.return_value = self.mock_session
            self.mock_session.exec.return_value.first.return_value = self.mock_user

            with patch('src.routers.auth.verify_password', return_value=True):
                # Act
                response = self.client.post("/api/auth/login", json=login_data)

                # Assert
                assert response.status_code == 200
                response_data = response.json()
                assert response_data["success"] is True
                assert "access_token" in response_data
                assert response_data["token_type"] == "bearer"
                assert response_data["user"]["email"] == login_data["email"]

    def test_login_user_invalid_credentials(self):
        """Test login with invalid credentials."""
        # Arrange
        login_data = {
            "email": "test@example.com",
            "password": "wrongpassword"
        }

        with patch('src.routers.auth.get_session') as mock_get_session:
            mock_get_session.return_value.__enter__.return_value = self.mock_session
            self.mock_session.exec.return_value.first.return_value = self.mock_user

            with patch('src.routers.auth.verify_password', return_value=False):
                # Act
                response = self.client.post("/api/auth/login", json=login_data)

                # Assert
                assert response.status_code == 401
                response_data = response.json()
                assert "Invalid email or password" in response_data["detail"]

    def test_login_user_not_found(self):
        """Test login with non-existent user."""
        # Arrange
        login_data = {
            "email": "nonexistent@example.com",
            "password": "any_password"
        }

        with patch('src.routers.auth.get_session') as mock_get_session:
            mock_get_session.return_value.__enter__.return_value = self.mock_session
            self.mock_session.exec.return_value.first.return_value = None

            # Act
            response = self.client.post("/api/auth/login", json=login_data)

            # Assert
            assert response.status_code == 401
            response_data = response.json()
            assert "Invalid email or password" in response_data["detail"]

    def test_login_user_missing_email(self):
        """Test login with missing email."""
        # Arrange
        login_data = {
            "password": "any_password"
        }

        # Act
        response = self.client.post("/api/auth/login", json=login_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_login_user_missing_password(self):
        """Test login with missing password."""
        # Arrange
        login_data = {
            "email": "test@example.com"
        }

        # Act
        response = self.client.post("/api/auth/login", json=login_data)

        # Assert
        assert response.status_code == 422  # Validation error

    def test_login_with_http_only_cookie(self):
        """Test that login sets httpOnly cookie."""
        # Arrange
        login_data = {
            "email": "test@example.com",
            "password": "SecurePassword123!"
        }

        with patch('src.routers.auth.get_session') as mock_get_session:
            mock_get_session.return_value.__enter__.return_value = self.mock_session
            self.mock_session.exec.return_value.first.return_value = self.mock_user

            with patch('src.routers.auth.verify_password', return_value=True):
                # Act
                response = self.client.post("/api/auth/login", json=login_data)

                # Assert
                assert response.status_code == 200
                # Check that the response sets a cookie
                assert "set-cookie" in response.headers
                assert "access_token" in response.headers["set-cookie"]