from pydantic import BaseModel, ConfigDict


class DashboardStatsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_employees: int
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int
    overdue_tasks: int
