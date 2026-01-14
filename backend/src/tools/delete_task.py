from typing import Dict, Any
from ..models.task import Task
from ..database import get_session
from sqlmodel import Session, select
from uuid import UUID


def delete_task_tool(user_id: str, task_id: str) -> Dict[str, Any]:
    """
    MCP tool to delete a task for a user.

    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to delete

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

            # Delete the task
            session.delete(task)
            session.commit()

            return {
                "success": True,
                "message": f"Task '{task.title}' deleted successfully"
            }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to delete task: {str(e)}"
        }


# Mock registration for MCP - in real implementation this would register with the MCP server
tool_config = {
    "name": "delete_task",
    "description": "Delete a task for the user",
    "input_schema": {
        "type": "object",
        "properties": {
            "user_id": {"type": "string", "description": "The ID of the user who owns the task"},
            "task_id": {"type": "string", "description": "The ID of the task to delete"}
        },
        "required": ["user_id", "task_id"]
    }
}