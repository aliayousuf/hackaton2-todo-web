from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    """
    Task model representing a todo item belonging to a specific user.

    Attributes:
        id: Unique identifier for the task (auto-increment integer)
        user_id: Owner reference (foreign key to users table, indexed)
        title: Task title (1-200 characters)
        description: Optional description (max 1000 characters)
        completed: Completion status (boolean, default false, indexed)
        created_at: Task creation timestamp
        updated_at: Task last update timestamp
    """
    id: int = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(max_length=1000)
    completed: bool = Field(default=False, index=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Task(id={self.id}, title='{self.title}', completed={self.completed})>"