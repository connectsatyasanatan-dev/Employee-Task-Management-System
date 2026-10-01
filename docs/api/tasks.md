# Task Management API Specification (Planned Specification)

Status: **Planned (Not Yet Implemented in Backend Routes)**  
Feature ID: `TASK-001` - `TASK-005`

> [!NOTE]
> The database model [`Task`](file:///d:/Task-Management/backend/app/models/task.py) and schemas [`TaskCreate`](file:///d:/Task-Management/backend/app/schemas/task.py) are defined, but FastAPI route handlers have not been created yet. This specification serves as design guidance for implementation.

---

## Proposed Route Endpoints

| Method | Path | Required Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | All Authenticated Users | List tasks. Admins see all tasks; Employees see assigned tasks only. Supports status/priority filtering & pagination. |
| `POST` | `/api/tasks` | `admin` | Create a new task and assign it to an active employee (`assigned_to_user_id`). |
| `GET` | `/api/tasks/{id}` | All Authenticated Users | Retrieve task details. Employees can only view tasks assigned to them. |
| `PUT` | `/api/tasks/{id}` | `admin` | Update task details (title, description, due date, priority, assignee). |
| `PATCH` | `/api/tasks/{id}/status` | Assignee / Admin | Update task status (`Pending` -> `In Progress` -> `Completed`). |
| `DELETE` | `/api/tasks/{id}` | `admin` | Soft delete or archive task. |
