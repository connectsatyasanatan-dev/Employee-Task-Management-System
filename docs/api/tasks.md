# Task Management API Specification

Base Path: `/api/tasks`  
Feature ID: `TASK-001` - `TASK-006`  
Status: **Implemented & Verified**

---

## 🔐 Authorization & Access Rules

1. **Admin Access**:
   * Full access to list all tasks, create tasks, edit task details, change assignees, update status, and delete tasks.
   * Can filter task lists by `assigned_to_user_id`, `status`, or `priority`.
2. **Employee Access**:
   * Restricted to view ONLY tasks assigned to their own `user_id`.
   * Cannot use query parameters to view or list other users' tasks.
   * Can update ONLY the `status` (`"Pending"`, `"In Progress"`, `"Completed"`) of tasks assigned to them via `PATCH /api/tasks/{task_id}/status`.
   * Requests for tasks assigned to other employees return `404 Not Found` (safe authorization response preventing information leaks).
3. **Assignee Validation**:
   * Tasks can only be assigned to users who exist in DB, are active (`is_active == True`), and have `role == "employee"`. Assigning tasks to `admin` users or inactive accounts returns `HTTP 400 Bad Request`.
4. **Date Constraint**:
   * `due_date` must be greater than or equal to `start_date` (`due_date >= start_date`).

---

## 🌐 Endpoints Specification

### 1. GET `/api/tasks`
* **Purpose**: List tasks with pagination and optional filters.
* **Auth Requirement**: Any authenticated user (`Authorization: Bearer <access_token>`).
* **Query Parameters**:
  * `page` (integer, default: `1`, min: `1`)
  * `page_size` (integer, default: `10`, min: `1`, max: `100`)
  * `status` (string, optional): `"Pending"`, `"In Progress"`, `"Completed"` (case-insensitive).
  * `priority` (string, optional): `"Low"`, `"Medium"`, `"High"` (case-insensitive).
  * `assigned_to_user_id` (integer, optional, Admin only): Filter tasks by assignee ID.
* **Response (200 OK)**:
```json
{
  "items": [
    {
      "id": 1,
      "title": "Design Database Schema",
      "description": "Create SQLite tables for task management",
      "assigned_to_user_id": 2,
      "assignee_name": "Jane Smith",
      "assignee_email": "jane.smith@example.com",
      "priority": "High",
      "status": "In Progress",
      "start_date": "2026-10-01",
      "due_date": "2026-10-05",
      "created_at": "2026-10-01T21:50:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 10,
  "total_pages": 1
}
```

---

### 2. POST `/api/tasks`
* **Purpose**: Create a new task and assign it to an active employee.
* **Auth Requirement**: Admin only (`Authorization: Bearer <access_token>`, role: `admin`).
* **Request Body**:
```json
{
  "title": "Build REST Endpoints",
  "description": "Implement FastAPI task router",
  "assigned_to_user_id": 2,
  "priority": "High",
  "status": "Pending",
  "start_date": "2026-10-01",
  "due_date": "2026-10-07"
}
```
* **Response (201 Created)**: `TaskResponse` object.
* **Error Responses**:
  * `400 Bad Request`: Invalid dates (`due_date < start_date`), invalid status/priority, or assignee is inactive/admin.

---

### 3. GET `/api/tasks/{task_id}`
* **Purpose**: Retrieve details for a specific task.
* **Auth Requirement**: Authenticated Admin or Assigned Employee.
* **Response (200 OK)**: `TaskResponse` object.
* **Error Responses**:
  * `404 Not Found`: Task does not exist or user is not authorized to view it.

---

### 4. PUT `/api/tasks/{task_id}`
* **Purpose**: Update task details, dates, priority, status, or assignee.
* **Auth Requirement**: Admin only (`role: admin`).
* **Request Body**: Partial or full fields (`title`, `description`, `assigned_to_user_id`, `priority`, `status`, `start_date`, `due_date`).
* **Response (200 OK)**: Updated `TaskResponse` object.
* **Error Responses**:
  * `404 Not Found`: Task does not exist.
  * `400 Bad Request`: Validation failure on assignee or dates.

---

### 5. PATCH `/api/tasks/{task_id}/status`
* **Purpose**: Update task completion status.
* **Auth Requirement**: Admin or assigned Employee.
* **Request Body**:
```json
{
  "status": "Completed"
}
```
* **Response (200 OK)**: Updated `TaskResponse` object.
* **Error Responses**:
  * `404 Not Found`: Task does not exist or belongs to another employee.
  * `422 Unprocessable Entity`: Status value not in `{"Pending", "In Progress", "Completed"}`.

---

### 6. DELETE `/api/tasks/{task_id}`
* **Purpose**: Permanently delete a task.
* **Auth Requirement**: Admin only (`role: admin`).
* **Response (200 OK)**:
```json
{
  "message": "Task deleted successfully"
}
```
* **Error Responses**:
  * `404 Not Found`: Task does not exist.

---

## 💻 Frontend UI Integration Details

* **Page Component**: [`frontend/src/pages/TasksPage.jsx`](file:///d:/Task-Management/frontend/src/pages/TasksPage.jsx)
* **Service Module**: [`frontend/src/api/taskApi.js`](file:///d:/Task-Management/frontend/src/api/taskApi.js)
* **Role Handling**:
  * **Admin View**: Displays organization-wide task board, assignee selector filter, "Create Task" button, "Edit Task" action, and "Delete Task" confirmation modal.
  * **Employee View**: Displays assigned task list, status/priority filters, and quick inline status update dropdown (`PATCH /api/tasks/{id}/status`).
* **UI Features**:
  * Multi-parameter task list filtering (Status, Priority, Assignee).
  * `TaskModal` for task creation/editing with date relationship validation (`due_date >= start_date`).
  * `TaskDetailModal` providing detailed metadata view and direct status changes.
  * `ConfirmDialog` for permanent task deletion (`DELETE /api/tasks/{id}`).

