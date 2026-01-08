from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime
import uuid

from ..models.user import User
from ..models.task import Task
from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse, TaskUpdateResponse, TaskDeleteResponse
from ..middleware.auth import get_current_active_user
from ..database import get_session

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("/", response_model=TaskListResponse)
def get_tasks(
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve all tasks belonging to the authenticated user.

    Args:
        current_user: Authenticated user (obtained via dependency injection)
        session: Database session for querying tasks

    Returns:
        TaskListResponse containing all user's tasks sorted by creation date (newest first)

    Raises:
        HTTPException: If there's an error retrieving tasks
    """
    try:
        # Query tasks for the current user, sorted by creation date (newest first)
        statement = (
            select(Task)
            .where(Task.user_id == current_user.id)
            .order_by(Task.created_at.desc())
        )
        tasks = session.exec(statement).all()

        return TaskListResponse(success=True, data=tasks)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving tasks: {str(e)}"
        )


@router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.

    Args:
        task_data: Task creation data (title, description)
        current_user: Authenticated user (obtained via dependency injection)
        session: Database session for creating task

    Returns:
        TaskResponse containing the created task

    Raises:
        HTTPException: If there's an error creating the task
    """
    try:
        # Create task instance with user_id and timestamps
        task = Task(
            user_id=current_user.id,
            title=task_data.title,
            description=task_data.description,
            completed=False,  # New tasks are not completed by default
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return task
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating task: {str(e)}"
        )


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve a specific task belonging to the authenticated user.

    Args:
        task_id: ID of the task to retrieve
        current_user: Authenticated user (obtained via dependency injection)
        session: Database session for querying task

    Returns:
        TaskResponse containing the requested task

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to the user
    """
    try:
        # Query for the task with the given ID that belongs to the current user
        statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        return task
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving task: {str(e)}"
        )


@router.put("/{task_id}", response_model=TaskUpdateResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task belonging to the authenticated user.

    Args:
        task_id: ID of the task to update
        task_data: Task update data (title, description, completed)
        current_user: Authenticated user (obtained via dependency injection)
        session: Database session for updating task

    Returns:
        TaskUpdateResponse containing the updated task

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to the user
    """
    try:
        # Query for the task with the given ID that belongs to the current user
        statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Update the task fields if provided in the request
        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
        if task_data.completed is not None:
            task.completed = task_data.completed

        # Update the timestamp
        task.updated_at = datetime.utcnow()

        session.add(task)
        session.commit()
        session.refresh(task)

        return TaskUpdateResponse(success=True, data=task)
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating task: {str(e)}"
        )


@router.patch("/{task_id}", response_model=TaskUpdateResponse)
def update_task_partial(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Partially update a specific task belonging to the authenticated user.
    Useful for toggling completion status with a single field update.

    Args:
        task_id: ID of the task to update
        task_data: Task update data (any combination of title, description, completed)
        current_user: Authenticated user (obtained via dependency injection)
        session: Database session for updating task

    Returns:
        TaskUpdateResponse containing the updated task

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to the user
    """
    try:
        # Query for the task with the given ID that belongs to the current user
        statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Update the task fields if provided in the request
        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
        if task_data.completed is not None:
            task.completed = task_data.completed

        # Update the timestamp
        task.updated_at = datetime.utcnow()

        session.add(task)
        session.commit()
        session.refresh(task)

        return TaskUpdateResponse(success=True, data=task)
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating task: {str(e)}"
        )


@router.delete("/{task_id}", response_model=TaskDeleteResponse)
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task belonging to the authenticated user.

    Args:
        task_id: ID of the task to delete
        current_user: Authenticated user (obtained via dependency injection)
        session: Database session for deleting task

    Returns:
        TaskDeleteResponse confirming successful deletion

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to the user
    """
    try:
        # Query for the task with the given ID that belongs to the current user
        statement = select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Delete the task
        session.delete(task)
        session.commit()

        return TaskDeleteResponse(success=True, message="Task deleted successfully")
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting task: {str(e)}"
        )