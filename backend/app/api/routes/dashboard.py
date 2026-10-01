from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.dashboard import DashboardStatsResponse

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard Analytics"],
)


@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
    status_code=status.HTTP_200_OK,
)
def get_dashboard_stats(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    """
    Retrieve real-time dashboard analytics metrics.
    - Admin: View system-wide metrics across all employees and tasks.
    - Employee: View personal workload metrics for assigned tasks.
    """
    today = date.today()

    if current_user.role == "admin":
        total_employees = (
            db.scalar(
                select(func.count()).where(
                    User.role == "employee",
                    User.is_active.is_(True),
                )
            )
            or 0
        )
        total_tasks = db.scalar(select(func.count()).select_from(Task)) or 0
        pending_tasks = (
            db.scalar(
                select(func.count()).where(
                    func.lower(Task.status) == "pending"
                )
            )
            or 0
        )
        in_progress_tasks = (
            db.scalar(
                select(func.count()).where(
                    func.lower(Task.status) == "in progress"
                )
            )
            or 0
        )
        completed_tasks = (
            db.scalar(
                select(func.count()).where(
                    func.lower(Task.status) == "completed"
                )
            )
            or 0
        )
        overdue_tasks = (
            db.scalar(
                select(func.count()).where(
                    func.lower(Task.status) != "completed",
                    Task.due_date < today,
                )
            )
            or 0
        )

        return DashboardStatsResponse(
            total_tasks=total_tasks,
            pending_tasks=pending_tasks,
            in_progress_tasks=in_progress_tasks,
            completed_tasks=completed_tasks,
            overdue_tasks=overdue_tasks,
            total_employees=total_employees,
            my_assigned_tasks=None,
        )
    else:
        user_tasks = Task.assigned_to_user_id == current_user.id

        total_tasks = (
            db.scalar(select(func.count()).where(user_tasks)) or 0
        )
        pending_tasks = (
            db.scalar(
                select(func.count()).where(
                    user_tasks, func.lower(Task.status) == "pending"
                )
            )
            or 0
        )
        in_progress_tasks = (
            db.scalar(
                select(func.count()).where(
                    user_tasks, func.lower(Task.status) == "in progress"
                )
            )
            or 0
        )
        completed_tasks = (
            db.scalar(
                select(func.count()).where(
                    user_tasks, func.lower(Task.status) == "completed"
                )
            )
            or 0
        )
        overdue_tasks = (
            db.scalar(
                select(func.count()).where(
                    user_tasks,
                    func.lower(Task.status) != "completed",
                    Task.due_date < today,
                )
            )
            or 0
        )

        return DashboardStatsResponse(
            total_tasks=total_tasks,
            pending_tasks=pending_tasks,
            in_progress_tasks=in_progress_tasks,
            completed_tasks=completed_tasks,
            overdue_tasks=overdue_tasks,
            total_employees=None,
            my_assigned_tasks=total_tasks,
        )
