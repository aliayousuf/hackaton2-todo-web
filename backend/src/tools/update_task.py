from typing import Dict, Any
from ..models.task import Task
from ..database import get_session
from sqlmodel import Session, select
from uuid import UUID


def update_task_tool(user_id: str, task_id: str, title: str = None, description: str = None, completed: bool = None) -> Dict[str, Any]:
    """
    MCP tool to update the details of a task for a user.

    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to update
        title: New title for the task (optional)
        description: New description for the task (optional)
        completed: New completion status for the task (optional)

    Returns:
        Dictionary with success status and message
    """
    try:
        # Validate user_id and task_id
        UUID(user_id)
        UUID(task_id)

        with get_session() as session:
            # Find the task that belongs to the user
            statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
            task = session.exec(statement).first()

            if not task:
                return {
                    "success": False,
                    "message": f"Task with ID {task_id} not found for user {user_id} or access denied"
                }

            # Update fields if provided
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if completed is not None:
                task.completed = completed

            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "message": f"Task '{task.title}' updated successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to update task: {str(e)}"
        }


# Mock registration for MCP - in real implementation this would register with the MCP server
tool_config = {
    "name": "update_task",
    "description": "Update the details of a task for the user",
    "input_schema": {
        "type": "object",
        "properties": {
            "user_id": {"type": "string", "description": "The ID of the user who owns the task"},
            "task_id": {"type": "string", "description": "The ID of the task to update"},
            "title": {"type": "string", "description": "New title for the task (optional)"},
            "description": {"type": "string", "description": "New description for the task (optional)"},
            "completed": {"type": "boolean", "description": "New completion status for the task (optional)"}
        },
        "required": ["user_id", "task_id"]
    }
}