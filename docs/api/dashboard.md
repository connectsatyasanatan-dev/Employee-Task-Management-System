# Dashboard Analytics API Specification

Base Path: `/api/dashboard`  
Feature ID: `DASH-001`  
Status: **Implemented & Verified**

---

## 🌐 Endpoint: GET `/api/dashboard/stats`

* **Purpose**: Retrieve real-time dashboard analytics metrics for total employees, total tasks, pending tasks, in-progress tasks, completed tasks, and overdue tasks.
* **Authentication Requirement**: Any authenticated user (`Authorization: Bearer <access_token>`).
* **Role Behavior**:
  * **Admin**: Returns system-wide metrics across all employees and tasks.
  * **Employee**: Returns personal workload metrics for tasks assigned to the authenticated user.
* **Calculation Rules**:
  * `total_employees`: Total count of active users in database where `role == "employee"` and `is_active == True`.
  * `total_tasks`: Count of tasks within the user's role scope.
  * `pending_tasks`: Count of tasks where `status == "Pending"`.
  * `in_progress_tasks`: Count of tasks where `status == "In Progress"`.
  * `completed_tasks`: Count of tasks where `status == "Completed"`.
  * `overdue_tasks`: Count of tasks where `status != "Completed"` and `due_date < current_date`.

---

## 📡 Request & Response Payload

### Request Header
```http
GET /api/dashboard/stats HTTP/1.1
Host: localhost:8000
Authorization: Bearer <access_token>
```

### Response (HTTP 200 OK)
```json
{
  "total_employees": 5,
  "total_tasks": 12,
  "pending_tasks": 4,
  "in_progress_tasks": 5,
  "completed_tasks": 2,
  "overdue_tasks": 1
}
```

---

## ⚠️ Error Responses

* `401 Unauthorized`: Missing or invalid Bearer access token.
