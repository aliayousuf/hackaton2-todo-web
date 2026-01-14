from typing import Dict, Any
from ..models.task import Task
from ..database import get_session
from sqlmodel import Session, select
from uuid import UUID
import json


def add_task_tool(user_id: str, title: str, description: str = "") -> Dict[str, Any]:
    """
    MCP tool to create a new task for a user.

    Args:
        user_id: The ID of the user creating the task
        title: The title of the task
        description: Optional detailed description of the task

    Returns:
        Dictionary with success status, task_id, and message
    """
    try:
        with get_session() as session:
            # Validate user_id format
            UUID(user_id)  # This will raise ValueError if invalid

            # Create task
            task = Task(
                title=title,
                description=description,
                completed=False,
                user_id=user_id
            )

            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "task_id": str(task.id),
                "message": f"Task '{title}' created successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "task_id": None,
            "message": f"Failed to create task: {str(e)}"
        }


# Mock registration for MCP - in real implementation this would register with the MCP server
tool_config = {
    "name": "add_task",
    "description": "Create a new task for the user",
    "input_schema": {
        "type": "object",
        "properties": {
            "user_id": {"type": "string", "description": "The ID of the user creating the task"},
            "title": {"type": "string", "description": "The title of the task"},
            "description": {"type": "string", "description": "Optional detailed description of the task"}
        },
        "required": ["user_id", "title"]
    }
}