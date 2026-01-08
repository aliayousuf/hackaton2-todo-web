from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class TaskBase(BaseModel):
    """Base task schema with common fields."""
    title: str
    description: Optional[str] = None
    completed: bool = False


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    title: str
    description: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Buy groceries",
                "description": "Milk, eggs, bread, fruits",
                "completed": False
            }
        }


class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Updated task title",
                "description": "Updated task description",
                "completed": True
            }
        }


class TaskResponse(TaskBase):
    """Schema for task response."""
    id: int
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread, fruits",
                "completed": False,
                "created_at": "2023-01-01T12:00:00Z",
                "updated_at": "2023-01-01T12:00:00Z"
            }
        }


class TaskListResponse(BaseModel):
    """Schema for task list response."""
    success: bool
    data: List[TaskResponse]

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "success": True,
                "data": [
                    {
                        "id": 1,
                        "user_id": "550e8400-e29b-41d4-a716-446655440000",
                        "title": "Buy groceries",
                        "description": "Milk, eggs, bread, fruits",
                        "completed": False,
                        "created_at": "2023-01-01T12:00:00Z",
                        "updated_at": "2023-01-01T12:00:00Z"
                    }
                ]
            }
        }


class TaskUpdateResponse(BaseModel):
    """Schema for task update response."""
    success: bool
    data: TaskResponse

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "id": 1,
                    "user_id": "550e8400-e29b-41d4-a716-446655440000",
                    "title": "Updated task title",
                    "description": "Updated task description",
                    "completed": True,
                    "created_at": "2023-01-01T12:00:00Z",
                    "updated_at": "2023-01-02T12:00:00Z"
                }
            }
        }


class TaskDeleteResponse(BaseModel):
    """Schema for task deletion response."""
    success: bool
    message: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Task deleted successfully"
            }
        }


class ErrorResponse(BaseModel):
    """Schema for error responses."""
    success: bool
    error: str

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": "Task not found"
            }
        }