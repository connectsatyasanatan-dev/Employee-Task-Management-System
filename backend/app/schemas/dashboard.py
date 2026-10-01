from typing import Optional
from pydantic import BaseModel, ConfigDict


class DashboardStatsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int
    overdue_tasks: int
    total_employees: Optional[int] = None
    my_assigned_tasks: Optional[int] = None
