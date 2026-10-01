import math
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_admin
from app.db.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import (
    ALLOWED_PRIORITIES,
    ALLOWED_STATUSES,
    PaginatedTaskResponse,
    TaskCreate,
    TaskResponse,
    TaskStatusUpdate,
    TaskUpdate,
)

router = APIRouter(
    prefix="/api/tasks",
    tags=["Task Management"],
)


def validate_assignee_user(user_id: int, db: Session) -> User:
    """
    Validate that the target assigned user exists, is active, and has the employee role.
    """
    user = db.scalar(select(User).where(User.id == user_id))

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assigned user not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assigned user account is inactive",
        )

    if user.role != "employee":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tasks can only be assigned to users with the employee role",
        )

    return user


@router.get(
    "",
    response_model=PaginatedTaskResponse,
    status_code=status.HTTP_200_OK,
)
def list_tasks(
    page: Annotated[int, Query(ge=1, description="Page number")] = 1,
    page_size: Annotated[
        int, Query(ge=1, le=100, description="Items per page")
    ] = 10,
    status_filter: Annotated[
        Optional[str], Query(alias="status", description="Filter by status")
    ] = None,
    priority: Annotated[
        Optional[str], Query(description="Filter by priority")
    ] = None,
    assigned_to_user_id: Annotated[
        Optional[int], Query(description="Admin filter by assignee user ID")
    ] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List tasks with optional filtering and pagination.
    - Admin: View all tasks or filter by any assignee.
    - Employee: Restricted to view ONLY tasks assigned to their own user ID.
    """
    statement = select(Task).outerjoin(Task.assignee)

    # Authorization filter
    if current_user.role != "admin":
        statement = statement.where(Task.assigned_to_user_id == current_user.id)
    elif assigned_to_user_id is not None:
        statement = statement.where(
            Task.assigned_to_user_id == assigned_to_user_id
        )

    # Status filter
    if status_filter and status_filter.strip():
        statement = statement.where(
            func.lower(Task.status) == status_filter.strip().lower()
        )

    # Priority filter
    if priority and priority.strip():
        statement = statement.where(
            func.lower(Task.priority) == priority.strip().lower()
        )

    # Count total
    count_statement = select(func.count()).select_from(statement.subquery())
    total = db.scalar(count_statement) or 0

    # Paginate results
    offset = (page - 1) * page_size
    paginated_statement = (
        statement.order_by(Task.id.desc()).offset(offset).limit(page_size)
    )
    tasks = db.scalars(paginated_statement).all()

    total_pages = math.ceil(total / page_size) if total > 0 else 1
    items = [TaskResponse.from_task(task) for task in tasks]

    return PaginatedTaskResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    task_data: TaskCreate,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Create and assign a new task to an active employee. Admin only.
    """
    # 1. Validate assignee user
    validate_assignee_user(task_data.assigned_to_user_id, db)

    # 2. Create task
    new_task = Task(
        title=task_data.title.strip(),
        description=task_data.description.strip()
        if task_data.description
        else None,
        assigned_to_user_id=task_data.assigned_to_user_id,
        priority=task_data.priority,
        status=task_data.status,
        start_date=task_data.start_date,
        due_date=task_data.due_date,
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return TaskResponse.from_task(new_task)


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
)
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve details for a specific task.
    - Admin: View any task.
    - Employee: View only tasks assigned to them.
    """
    task = db.scalar(select(Task).where(Task.id == task_id))

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Authorization guard: Employees can only view their own assigned tasks
    if current_user.role != "admin" and task.assigned_to_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return TaskResponse.from_task(task)


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
)
def update_task(
    task_id: int,
    update_data: TaskUpdate,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Update task details and assignment. Admin only.
    """
    task = db.scalar(select(Task).where(Task.id == task_id))

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Validate new assignee if provided
    if update_data.assigned_to_user_id is not None:
        validate_assignee_user(update_data.assigned_to_user_id, db)
        task.assigned_to_user_id = update_data.assigned_to_user_id

    # Validate dates
    effective_start = (
        update_data.start_date
        if update_data.start_date is not None
        else task.start_date
    )
    effective_due = (
        update_data.due_date
        if update_data.due_date is not None
        else task.due_date
    )

    if effective_due < effective_start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="due_date cannot be earlier than start_date",
        )

    if update_data.title is not None:
        task.title = update_data.title.strip()
    if update_data.description is not None:
        task.description = update_data.description.strip() if update_data.description else None
    if update_data.priority is not None:
        task.priority = update_data.priority
    if update_data.status is not None:
        task.status = update_data.status
    if update_data.start_date is not None:
        task.start_date = update_data.start_date
    if update_data.due_date is not None:
        task.due_date = update_data.due_date

    db.commit()
    db.refresh(task)

    return TaskResponse.from_task(task)


@router.patch(
    "/{task_id}/status",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
)
def update_task_status(
    task_id: int,
    status_data: TaskStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update status of a task.
    - Admin or assigned Employee can update status.
    - Employees cannot update tasks assigned to others.
    """
    task = db.scalar(select(Task).where(Task.id == task_id))

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Authorization guard
    if current_user.role != "admin" and task.assigned_to_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    task.status = status_data.status
    db.commit()
    db.refresh(task)

    return TaskResponse.from_task(task)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_200_OK,
)
def delete_task(
    task_id: int,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Delete a task. Admin only.
    """
    task = db.scalar(select(Task).where(Task.id == task_id))

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}
