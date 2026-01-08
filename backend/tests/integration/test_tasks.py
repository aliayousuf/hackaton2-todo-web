import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine, select
from sqlmodel.pool import StaticPool
from datetime import datetime
import uuid

from src.main import create_app
from src.models.user import User
from src.models.task import Task
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


class TestTasksIntegration:
    """Integration tests for tasks endpoints."""

    def test_task_crud_operations(self, client: TestClient, session: Session):
        """Test complete CRUD operations for tasks."""
        # First, register and login a user to get authentication
        register_data = {
            "email": "task_user@example.com",
            "password": "SecurePassword123!"
        }
        register_response = client.post("/api/auth/register", json=register_data)
        assert register_response.status_code == 200

        # Login to get the token
        login_data = {
            "email": "task_user@example.com",
            "password": "SecurePassword123!"
        }
        login_response = client.post("/api/auth/login", json=login_data)
        assert login_response.status_code == 200

        # Get the user from the database to use in tests
        user = session.exec(select(User).where(User.email == "task_user@example.com")).first()
        assert user is not None

        # Test creating a task
        task_data = {
            "title": "Test Task",
            "description": "Test Description"
        }
        create_response = client.post("/api/tasks", json=task_data)
        assert create_response.status_code == 200

        created_task = create_response.json()
        assert created_task["title"] == "Test Task"
        assert created_task["description"] == "Test Description"
        assert created_task["completed"] is False

        # Test getting the specific task
        task_id = created_task["id"]
        get_response = client.get(f"/api/tasks/{task_id}")
        assert get_response.status_code == 200

        retrieved_task = get_response.json()
        assert retrieved_task["title"] == "Test Task"

        # Test getting all tasks for the user
        get_all_response = client.get("/api/tasks")
        assert get_all_response.status_code == 200

        tasks_list = get_all_response.json()
        assert tasks_list["success"] is True
        assert len(tasks_list["data"]) == 1
        assert tasks_list["data"][0]["title"] == "Test Task"

        # Test updating the task
        update_data = {
            "title": "Updated Task",
            "completed": True
        }
        update_response = client.put(f"/api/tasks/{task_id}", json=update_data)
        assert update_response.status_code == 200

        updated_task = update_response.json()
        assert updated_task["success"] is True
        assert updated_task["data"]["title"] == "Updated Task"
        assert updated_task["data"]["completed"] is True

        # Test partial update (toggle completion)
        patch_data = {
            "completed": False
        }
        patch_response = client.patch(f"/api/tasks/{task_id}", json=patch_data)
        assert patch_response.status_code == 200

        patched_task = patch_response.json()
        assert patched_task["success"] is True
        assert patched_task["data"]["completed"] is False

        # Test deleting the task
        delete_response = client.delete(f"/api/tasks/{task_id}")
        assert delete_response.status_code == 200

        delete_result = delete_response.json()
        assert delete_result["success"] is True

        # Verify the task is deleted by trying to get it
        get_deleted_response = client.get(f"/api/tasks/{task_id}")
        assert get_deleted_response.status_code == 404

    def test_user_data_isolation(self, client: TestClient, session: Session):
        """Test that users can only access their own tasks."""
        # Register first user
        user1_data = {
            "email": "user1@example.com",
            "password": "SecurePassword123!"
        }
        client.post("/api/auth/register", json=user1_data)

        # Register second user
        user2_data = {
            "email": "user2@example.com",
            "password": "SecurePassword123!"
        }
        client.post("/api/auth/register", json=user2_data)

        # Login as first user and create a task
        login1_response = client.post("/api/auth/login", json=user1_data)
        assert login1_response.status_code == 200

        task_data = {
            "title": "User 1 Task",
            "description": "This belongs to user 1"
        }
        create_response = client.post("/api/tasks", json=task_data)
        assert create_response.status_code == 200
        task1 = create_response.json()
        assert task1["title"] == "User 1 Task"

        # Login as second user
        login2_response = client.post("/api/auth/login", json=user2_data)
        assert login2_response.status_code == 200

        # Try to access the first user's task by ID - should return 404
        task1_id = task1["id"]
        get_task_response = client.get(f"/api/tasks/{task1_id}")
        assert get_task_response.status_code == 404

        # Try to update the first user's task - should return 404
        update_response = client.put(f"/api/tasks/{task1_id}", json={"title": "Hacked"})
        assert update_response.status_code == 404

        # Try to delete the first user's task - should return 404
        delete_response = client.delete(f"/api/tasks/{task1_id}")
        assert delete_response.status_code == 404

        # Get tasks for second user - should return empty list
        get_all_response = client.get("/api/tasks")
        assert get_all_response.status_code == 200
        tasks_list = get_all_response.json()
        assert len(tasks_list["data"]) == 0

        # Create a task for second user
        task2_data = {
            "title": "User 2 Task",
            "description": "This belongs to user 2"
        }
        create_response2 = client.post("/api/tasks", json=task2_data)
        assert create_response2.status_code == 200
        task2 = create_response2.json()
        assert task2["title"] == "User 2 Task"

        # Login back as first user
        client.post("/api/auth/login", json=user1_data)

        # Get tasks for first user - should only see their own task
        get_all_response1 = client.get("/api/tasks")
        assert get_all_response1.status_code == 200
        tasks_list1 = get_all_response1.json()
        assert len(tasks_list1["data"]) == 1
        assert tasks_list1["data"][0]["title"] == "User 1 Task"

        # Login as second user again
        client.post("/api/auth/login", json=user2_data)

        # Get tasks for second user - should only see their own task
        get_all_response2 = client.get("/api/tasks")
        assert get_all_response2.status_code == 200
        tasks_list2 = get_all_response2.json()
        assert len(tasks_list2["data"]) == 1
        assert tasks_list2["data"][0]["title"] == "User 2 Task"

    def test_task_validation(self, client: TestClient, session: Session):
        """Test task validation rules."""
        # Register and login a user
        register_data = {
            "email": "validation_user@example.com",
            "password": "SecurePassword123!"
        }
        client.post("/api/auth/register", json=register_data)

        login_data = {
            "email": "validation_user@example.com",
            "password": "SecurePassword123!"
        }
        client.post("/api/auth/login", json=login_data)

        # Try to create a task without title - should fail
        invalid_task_data = {
            "description": "Task without title"
        }
        create_response = client.post("/api/tasks", json=invalid_task_data)
        assert create_response.status_code != 200  # Should not be successful

        # Try to create a task with title too long - should fail
        long_title_task = {
            "title": "A" * 201,  # More than 200 characters
            "description": "Task with long title"
        }
        create_long_response = client.post("/api/tasks", json=long_title_task)
        assert create_long_response.status_code != 200  # Should not be successful

        # Create a valid task - should succeed
        valid_task_data = {
            "title": "Valid Task Title",
            "description": "Valid task description"
        }
        create_valid_response = client.post("/api/tasks", json=valid_task_data)
        assert create_valid_response.status_code == 200

        created_task = create_valid_response.json()
        assert created_task["title"] == "Valid Task Title"

    def test_task_sorting(self, client: TestClient, session: Session):
        """Test that tasks are sorted by creation date (newest first)."""
        # Register and login a user
        register_data = {
            "email": "sort_user@example.com",
            "password": "SecurePassword123!"
        }
        client.post("/api/auth/register", json=register_data)

        login_data = {
            "email": "sort_user@example.com",
            "password": "SecurePassword123!"
        }
        client.post("/api/auth/login", json=login_data)

        # Create tasks in a specific order
        task1_data = {"title": "First Task", "description": "Created first"}
        response1 = client.post("/api/tasks", json=task1_data)
        assert response1.status_code == 200

        task2_data = {"title": "Second Task", "description": "Created second"}
        response2 = client.post("/api/tasks", json=task2_data)
        assert response2.status_code == 200

        task3_data = {"title": "Third Task", "description": "Created third"}
        response3 = client.post("/api/tasks", json=task3_data)
        assert response3.status_code == 200

        # Get all tasks and verify they're sorted by creation date (newest first)
        get_all_response = client.get("/api/tasks")
        assert get_all_response.status_code == 200

        tasks_list = get_all_response.json()
        assert len(tasks_list["data"]) == 3

        # The third task should be first (newest), then second, then first
        assert tasks_list["data"][0]["title"] == "Third Task"
        assert tasks_list["data"][1]["title"] == "Second Task"
        assert tasks_list["data"][2]["title"] == "First Task"