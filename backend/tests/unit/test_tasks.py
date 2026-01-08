import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from sqlmodel import Session, select
from datetime import datetime
import uuid

from src.main import create_app
from src.models.user import User
from src.models.task import Task
from src.schemas.task import TaskCreate


class TestTasksUnit:
    """Unit tests for tasks endpoints."""

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

    def test_get_tasks_success(self):
        """Test successful retrieval of user's tasks."""
        # Arrange
        mock_tasks = [
            Task(
                id=1,
                user_id=self.mock_user.id,
                title="Test Task 1",
                description="Test Description 1",
                completed=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            Task(
                id=2,
                user_id=self.mock_user.id,
                title="Test Task 2",
                description="Test Description 2",
                completed=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        ]

        with patch('src.routers.tasks.get_current_active_user', return_value=self.mock_user):
            with patch('src.routers.tasks.get_session') as mock_get_session:
                mock_get_session.return_value.__enter__.return_value = self.mock_session
                self.mock_session.exec.return_value.all.return_value = mock_tasks

                # Act
                response = self.client.get("/api/tasks")

                # Assert
                assert response.status_code == 200
                response_data = response.json()
                assert response_data["success"] is True
                assert len(response_data["data"]) == 2
                assert response_data["data"][0]["title"] == "Test Task 1"
                assert response_data["data"][1]["title"] == "Test Task 2"

    def test_create_task_success(self):
        """Test successful creation of a task."""
        # Arrange
        task_data = {
            "title": "New Task",
            "description": "New Task Description"
        }

        created_task = Task(
            id=1,
            user_id=self.mock_user.id,
            title=task_data["title"],
            description=task_data["description"],
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        with patch('src.routers.tasks.get_current_active_user', return_value=self.mock_user):
            with patch('src.routers.tasks.get_session') as mock_get_session:
                mock_get_session.return_value.__enter__.return_value = self.mock_session
                self.mock_session.add.return_value = None
                self.mock_session.commit.return_value = None
                self.mock_session.refresh.return_value = None
                self.mock_session.add.side_effect = lambda obj: setattr(obj, 'id', 1) or setattr(obj, 'user_id', self.mock_user.id)

                # Act
                response = self.client.post("/api/tasks", json=task_data)

                # Assert
                assert response.status_code == 200
                response_data = response.json()
                assert response_data["title"] == task_data["title"]
                assert response_data["description"] == task_data["description"]
                assert response_data["completed"] is False

    def test_create_task_missing_title(self):
        """Test creating a task without a title."""
        # Arrange
        task_data = {
            "description": "Task without title"
        }

        with patch('src.routers.tasks.get_current_active_user', return_value=self.mock_user):
            # Act
            response = self.client.post("/api/tasks", json=task_data)

            # Assert
            assert response.status_code == 422  # Validation error

    def test_get_specific_task_success(self):
        """Test successful retrieval of a specific task."""
        # Arrange
        task = Task(
            id=1,
            user_id=self.mock_user.id,
            title="Test Task",
            description="Test Description",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        with patch('src.routers.tasks.get_current_active_user', return_value=self.mock_user):
            with patch('src.routers.tasks.get_session') as mock_get_session:
                mock_get_session.return_value.__enter__.return_value = self.mock_session
                self.mock_session.exec.return_value.first.return_value = task

                # Act
                response = self.client.get("/api/tasks/1")

                # Assert
                assert response.status_code == 200
                response_data = response.json()
                assert response_data["title"] == "Test Task"

    def test_update_task_success(self):
        """Test successful update of a task."""
        # Arrange
        existing_task = Task(
            id=1,
            user_id=self.mock_user.id,
            title="Old Title",
            description="Old Description",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        update_data = {
            "title": "Updated Title",
            "description": "Updated Description",
            "completed": True
        }

        with patch('src.routers.tasks.get_current_active_user', return_value=self.mock_user):
            with patch('src.routers.tasks.get_session') as mock_get_session:
                mock_get_session.return_value.__enter__.return_value = self.mock_session
                self.mock_session.exec.return_value.first.return_value = existing_task
                self.mock_session.add.return_value = None
                self.mock_session.commit.return_value = None
                self.mock_session.refresh.return_value = None

                # Act
                response = self.client.put("/api/tasks/1", json=update_data)

                # Assert
                assert response.status_code == 200
                response_data = response.json()
                assert response_data["success"] is True
                assert response_data["data"]["title"] == update_data["title"]
                assert response_data["data"]["completed"] is True

    def test_update_task_partial_success(self):
        """Test successful partial update of a task (e.g., toggle completion)."""
        # Arrange
        existing_task = Task(
            id=1,
            user_id=self.mock_user.id,
            title="Test Task",
            description="Test Description",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        update_data = {
            "completed": True
        }

        with patch('src.routers.tasks.get_current_active_user', return_value=self.mock_user):
            with patch('src.routers.tasks.get_session') as mock_get_session:
                mock_get_session.return_value.__enter__.return_value = self.mock_session
                self.mock_session.exec.return_value.first.return_value = existing_task
                self.mock_session.add.return_value = None
                self.mock_session.commit.return_value = None
                self.mock_session.refresh.return_value = None

                # Act
                response = self.client.patch("/api/tasks/1", json=update_data)

                # Assert
                assert response.status_code == 200
                response_data = response.json()
                assert response_data["success"] is True
                assert response_data["data"]["completed"] is True

    def test_delete_task_success(self):
        """Test successful deletion of a task."""
        # Arrange
        task = Task(
            id=1,
            user_id=self.mock_user.id,
            title="Test Task",
            description="Test Description",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        with patch('src.routers.tasks.get_current_active_user', return_value=self.mock_user):
            with patch('src.routers.tasks.get_session') as mock_get_session:
                mock_get_session.return_value.__enter__.return_value = self.mock_session
                self.mock_session.exec.return_value.first.return_value = task
                self.mock_session.delete.return_value = None
                self.mock_session.commit.return_value = None

                # Act
                response = self.client.delete("/api/tasks/1")

                # Assert
                assert response.status_code == 200
                response_data = response.json()
                assert response_data["success"] is True
                assert "deleted successfully" in response_data["message"]