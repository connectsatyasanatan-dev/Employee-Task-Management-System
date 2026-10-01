from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = None
    assigned_to_user_id: int
    priority: str = "Medium"
    status: str = "Pending"
    start_date: date
    due_date: date


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    assigned_to_user_id: int
    priority: str
    status: str
    start_date: date
    due_date: date