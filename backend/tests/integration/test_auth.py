import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine, select
from sqlmodel.pool import StaticPool
from datetime import datetime
import uuid

from src.main import create_app
from src.models.user import User
from src.database import get_session


@pytest.fixture(name="engine")
def fixture_engine():
    """Create an in-memory SQLite database for testing."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(bind=engine)
    return engine


@pytest.fixture(name="client")
def fixture_client(engine):
    """Create a test client with dependency overrides."""
    def get_session_override():
        with Session(engine) as session:
            yield session

    app = create_app()
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    return client


@pytest.fixture(name="session")
def fixture_session(engine):
    """Create a session for testing."""
    with Session(engine) as session:
        yield session


class TestAuthIntegration:
    """Integration tests for authentication endpoints."""

    def test_user_registration_and_login_flow(self, client: TestClient, session: Session):
        """Test complete user registration and login flow."""
        # Register a new user
        register_data = {
            "email": "integration_test@example.com",
            "password": "SecurePassword123!"
        }

        response = client.post("/api/auth/register", json=register_data)
        assert response.status_code == 200

        response_data = response.json()
        assert response_data["success"] is True
        assert response_data["user"]["email"] == register_data["email"]

        # Verify user was created in the database
        user_in_db = session.exec(
            select(User).where(User.email == register_data["email"])
        ).first()
        assert user_in_db is not None
        assert user_in_db.email == register_data["email"]

        # Attempt to login with the registered user
        login_data = {
            "email": register_data["email"],
            "password": register_data["password"]
        }

        login_response = client.post("/api/auth/login", json=login_data)
        assert login_response.status_code == 200

        login_response_data = login_response.json()
        assert login_response_data["success"] is True
        assert "access_token" in login_response_data
        assert login_response_data["token_type"] == "bearer"

        # Verify that the response sets the access token cookie
        assert "set-cookie" in login_response.headers
        assert "access_token" in login_response.headers["set-cookie"]

    def test_duplicate_email_registration_fails(self, client: TestClient, session: Session):
        """Test that registering with an existing email fails."""
        # Register the first user
        user_data = {
            "email": "duplicate_test@example.com",
            "password": "SecurePassword123!"
        }

        response = client.post("/api/auth/register", json=user_data)
        assert response.status_code == 200

        # Try to register another user with the same email
        duplicate_response = client.post("/api/auth/register", json=user_data)
        assert duplicate_response.status_code == 409
        assert "already exists" in duplicate_response.json()["detail"]

    def test_login_with_invalid_credentials(self, client: TestClient, session: Session):
        """Test login with invalid credentials."""
        # Try to login with non-existent user
        login_data = {
            "email": "nonexistent@example.com",
            "password": "any_password"
        }

        response = client.post("/api/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]

        # Register a user first
        register_data = {
            "email": "login_test@example.com",
            "password": "SecurePassword123!"
        }

        client.post("/api/auth/register", json=register_data)

        # Try to login with wrong password
        wrong_password_data = {
            "email": "login_test@example.com",
            "password": "wrong_password"
        }

        wrong_password_response = client.post("/api/auth/login", json=wrong_password_data)
        assert wrong_password_response.status_code == 401
        assert "Invalid email or password" in wrong_password_response.json()["detail"]

    def test_email_case_insensitive_registration(self, client: TestClient, session: Session):
        """Test that email registration is case-insensitive."""
        # Register with lowercase email
        user_data = {
            "email": "case_test@example.com",
            "password": "SecurePassword123!"
        }

        response = client.post("/api/auth/register", json=user_data)
        assert response.status_code == 200

        # Try to register with same email in different case
        duplicate_case_data = {
            "email": "CASE_TEST@EXAMPLE.COM",
            "password": "SecurePassword123!"
        }

        duplicate_response = client.post("/api/auth/register", json=duplicate_case_data)
        assert duplicate_response.status_code == 409
        assert "already exists" in duplicate_response.json()["detail"]

    def test_email_case_insensitive_login(self, client: TestClient, session: Session):
        """Test that email login is case-insensitive."""
        # Register with lowercase email
        register_data = {
            "email": "login_case_test@example.com",
            "password": "SecurePassword123!"
        }

        client.post("/api/auth/register", json=register_data)

        # Login with different case
        login_data = {
            "email": "LOGIN_CASE_TEST@EXAMPLE.COM",
            "password": "SecurePassword123!"
        }

        response = client.post("/api/auth/login", json=login_data)
        assert response.status_code == 200

        response_data = response.json()
        assert response_data["success"] is True
        assert "access_token" in response_data

    def test_password_strength_requirements(self, client: TestClient, session: Session):
        """Test password strength validation."""
        # Test with too short password
        weak_password_data = {
            "email": "weak_password_test@example.com",
            "password": "weak"
        }

        response = client.post("/api/auth/register", json=weak_password_data)
        assert response.status_code == 400

        # Test with strong password
        strong_password_data = {
            "email": "strong_password_test@example.com",
            "password": "StrongPassword123!"
        }

        strong_response = client.post("/api/auth/register", json=strong_password_data)
        assert strong_response.status_code == 200

        strong_response_data = strong_response.json()
        assert strong_response_data["success"] is True

    def test_email_format_validation(self, client: TestClient, session: Session):
        """Test email format validation."""
        # Test with invalid email format
        invalid_email_data = {
            "email": "invalid-email",
            "password": "SecurePassword123!"
        }

        response = client.post("/api/auth/register", json=invalid_email_data)
        assert response.status_code == 400

        # Test with valid email format
        valid_email_data = {
            "email": "valid.email@test-domain.com",
            "password": "SecurePassword123!"
        }

        valid_response = client.post("/api/auth/register", json=valid_email_data)
        assert valid_response.status_code == 200

        valid_response_data = valid_response.json()
        assert valid_response_data["success"] is True

    def test_login_sets_http_only_cookie(self, client: TestClient, session: Session):
        """Test that successful login sets httpOnly cookie."""
        # Register a user first
        register_data = {
            "email": "cookie_test@example.com",
            "password": "SecurePassword123!"
        }

        client.post("/api/auth/register", json=register_data)

        # Login with the registered user
        login_data = {
            "email": "cookie_test@example.com",
            "password": "SecurePassword123!"
        }

        response = client.post("/api/auth/login", json=login_data)
        assert response.status_code == 200

        # Verify that the response sets the access token cookie
        assert "set-cookie" in response.headers
        cookie_header = response.headers["set-cookie"]
        assert "access_token" in cookie_header
        assert "HttpOnly" in cookie_header
        assert "SameSite" in cookie_header

    def test_login_flow_with_cookie_authentication(self, client: TestClient, session: Session):
        """Test the complete login flow with cookie-based authentication."""
        # Register a user
        register_data = {
            "email": "cookie_auth_test@example.com",
            "password": "SecurePassword123!"
        }

        register_response = client.post("/api/auth/register", json=register_data)
        assert register_response.status_code == 200

        # Login to get the cookie
        login_data = {
            "email": "cookie_auth_test@example.com",
            "password": "SecurePassword123!"
        }

        login_response = client.post("/api/auth/login", json=login_data)
        assert login_response.status_code == 200

        # Extract the cookie from the response
        cookie_header = login_response.headers.get("set-cookie", "")
        assert "access_token" in cookie_header