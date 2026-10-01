# Dashboard Analytics API Specification

Base Path: `/api/dashboard`  
Feature ID: `DASH-001`  
Status: **Implemented & Verified**

---

## 🌐 Endpoint: GET `/api/dashboard/stats`

* **Purpose**: Retrieve real-time dashboard analytics metrics for total employees, total tasks, pending tasks, in-progress tasks, completed tasks, and overdue tasks.
* **Authentication Requirement**: Any authenticated user (`Authorization: Bearer <access_token>`).
* **Role Behavior & Security Isolation**:
  * **Admin**: Returns system-wide metrics across all employees and tasks, including `total_employees`.
  * **Employee**: Returns personal workload metrics for tasks assigned to the authenticated user. Excludes `total_employees` (`null` or omitted) to prevent exposing organization size.
* **Calculation Rules**:
  * `total_tasks`: Count of tasks within user role scope.
  * `pending_tasks`: Count of tasks where `status == "Pending"`.
  * `in_progress_tasks`: Count of tasks where `status == "In Progress"`.
  * `completed_tasks`: Count of tasks where `status == "Completed"`.
  * `overdue_tasks`: Count of tasks where `status != "Completed"` and `due_date < current_date`.
  * `total_employees` (Admin Only): Count of active users with `role == "employee"`.

---

## 📡 Request & Response Payloads

### 1. Admin Response (HTTP 200 OK)
```json
{
  "total_tasks": 12,
  "pending_tasks": 4,
  "in_progress_tasks": 5,
  "completed_tasks": 2,
  "overdue_tasks": 1,
  "total_employees": 5,
  "my_assigned_tasks": null
}
```

### 2. Employee Response (HTTP 200 OK)
```json
{
  "total_tasks": 3,
  "pending_tasks": 1,
  "in_progress_tasks": 1,
  "completed_tasks": 1,
  "overdue_tasks": 0,
  "total_employees": null,
  "my_assigned_tasks": 3
}
```

---

## ⚠️ Error Responses

* `401 Unauthorized`: Missing or invalid Bearer access token.

---

## 💻 Frontend UI Integration Details

* **Component**: [`frontend/src/pages/DashboardPage.jsx`](file:///d:/Task-Management/frontend/src/pages/DashboardPage.jsx)
* **Service Method**: `dashboardApi.getDashboardStats()`
* **Role Handling**:
  * Reads `user.role` from `AuthContext` via `useAuth()`.
  * Renders `Total Employees` stat card ONLY if `isAdmin === true` and `total_employees` is a non-null integer.
  * Employee view shows "My Assigned Tasks" card instead of "Total Tasks", hiding employee headcount.
* **Task Distribution Chart**:
  * Renders a responsive Recharts `<PieChart>` aggregating `pending_tasks`, `in_progress_tasks`, and `completed_tasks`.
  * Includes an accessible textual summary breakdown alongside custom legend indicators for color-independent accessibility.
* **Recent Tasks Integration**:
  * Utilizes `taskApi.getTasks({ page: 1, page_size: 5 })` inside `RecentTasksTable.jsx`.
  * Backend automatically scopes returned task items to the authenticated user's role (Admin sees organization-wide recent tasks; Employee sees personal assigned tasks).
* **UX States**:
  * **Loading**: Render skeleton pulse cards (`.skeleton-card`) and table skeleton rows (`.table-skeleton`).
  * **Empty State**: Renders clean informational cards when task count or stats are zero.
  * **Error State**: Displays user-friendly alert box with a "Retry Data" action without exposing sensitive stack traces.

