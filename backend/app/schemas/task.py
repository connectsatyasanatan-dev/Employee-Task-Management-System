from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator
from app.models.task import Task

ALLOWED_PRIORITIES = {"Low", "Medium", "High"}
ALLOWED_STATUSES = {"Pending", "In Progress", "Completed"}


class TaskCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: Optional[str] = None
    assigned_to_user_id: int
    priority: str = "Medium"
    status: str = "Pending"
    start_date: date
    due_date: date

    @model_validator(mode="after")
    def validate_task_create(self) -> "TaskCreate":
        if self.priority not in ALLOWED_PRIORITIES:
            raise ValueError(
                f"Priority must be one of {sorted(ALLOWED_PRIORITIES)}"
            )
        if self.status not in ALLOWED_STATUSES:
            raise ValueError(
                f"Status must be one of {sorted(ALLOWED_STATUSES)}"
            )
        if self.due_date < self.start_date:
            raise ValueError("due_date cannot be earlier than start_date")
        return self


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = None
    assigned_to_user_id: Optional[int] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[date] = None
    due_date: Optional[date] = None

    @model_validator(mode="after")
    def validate_task_update(self) -> "TaskUpdate":
        if self.priority is not None and self.priority not in ALLOWED_PRIORITIES:
            raise ValueError(
                f"Priority must be one of {sorted(ALLOWED_PRIORITIES)}"
            )
        if self.status is not None and self.status not in ALLOWED_STATUSES:
            raise ValueError(
                f"Status must be one of {sorted(ALLOWED_STATUSES)}"
            )
        return self


class TaskStatusUpdate(BaseModel):
    status: str

    @model_validator(mode="after")
    def validate_status(self) -> "TaskStatusUpdate":
        if self.status not in ALLOWED_STATUSES:
            raise ValueError(
                f"Status must be one of {sorted(ALLOWED_STATUSES)}"
            )
        return self


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    assigned_to_user_id: int
    assignee_name: Optional[str] = None
    assignee_email: Optional[str] = None
    priority: str
    status: str
    start_date: date
    due_date: date
    created_at: datetime

    @classmethod
    def from_task(cls, task: Task) -> "TaskResponse":
        assignee = task.assignee
        return cls(
            id=task.id,
            title=task.title,
            description=task.description,
            assigned_to_user_id=task.assigned_to_user_id,
            assignee_name=assignee.name if assignee else None,
            assignee_email=assignee.email if assignee else None,
            priority=task.priority,
            status=task.status,
            start_date=task.start_date,
            due_date=task.due_date,
            created_at=task.created_at,
        )


class PaginatedTaskResponse(BaseModel):
    items: list[TaskResponse]
    total: int
    page: int
    page_size: int
    total_pages: int