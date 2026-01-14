from typing import Dict, Any, List
from ..models.task import Task
from ..database import get_session
from sqlmodel import Session, select
from uuid import UUID


def list_tasks_tool(user_id: str, filter: str = "all") -> Dict[str, Any]:
    """
    MCP tool to retrieve all tasks for a user.

    Args:
        user_id: The ID of the user whose tasks to retrieve
        filter: Filter for task completion status ("all", "completed", "pending")

    Returns:
        Dictionary with success status, tasks list, and message
    """
    try:
        # Validate user_id format
        UUID(user_id)  # This will raise ValueError if invalid

        with get_session() as session:
            # Build query based on filter
            query = select(Task).where(Task.user_id == user_id)

            if filter == "completed":
                query = query.where(Task.completed == True)
            elif filter == "pending":
                query = query.where(Task.completed == False)

            tasks = session.exec(query).all()

            # Convert tasks to dict format
            tasks_list = []
            for task in tasks:
                task_dict = {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None
                }
                tasks_list.append(task_dict)

            return {
                "success": True,
                "tasks": tasks_list,
                "message": f"Retrieved {len(tasks_list)} tasks for user"
            }
    except Exception as e:
        return {
            "success": False,
            "tasks": [],
            "message": f"Failed to retrieve tasks: {str(e)}"
        }


# Mock registration for MCP - in real implementation this would register with the MCP server
tool_config = {
    "name": "list_tasks",
    "description": "Retrieve all tasks for the user",
    "input_schema": {
        "type": "object",
        "properties": {
            "user_id": {"type": "string", "description": "The ID of the user whose tasks to retrieve"},
            "filter": {
                "type": "string",
                "enum": ["all", "completed", "pending"],
                "description": "Filter for task completion status",
                "default": "all"
            }
        },
        "required": ["user_id"]
    }
}