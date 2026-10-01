# Project Overview — Employee Task Management System

## 📌 Purpose & Problem Statement

Organizations require a streamlined, secure system to manage workforce directory profiles, assign operational tasks, track task progress, and maintain accountability across departments.

The **Employee Task Management System** solves this by providing:
1. **Administrative Control**: Managing employee accounts, department assignments, and access statuses.
2. **Task Allocation**: Creating, assigning, and monitoring work items with priority levels and target completion dates.
3. **Employee Self-Service**: Allowing assigned personnel to view assigned tasks and update work status.
4. **Secure Access Control**: Implementing Role-Based Access Control (RBAC) to isolate administrative privileges from employee operations.

---

## 👥 Target Users & Personas

| Persona | Role Key | Permissions & Access Capabilities |
| :--- | :--- | :--- |
| **System Administrator** | `admin` | Full management of employee directory, task creation, task assignment, account activation/deactivation, and system-wide visibility. |
| **Employee** | `employee` | Access to personal profile (`GET /api/auth/me`), viewing assigned tasks, and updating progress status (`Pending` -> `In Progress` -> `Completed`). |

---

## 🛠️ Technology Stack Breakdown

* **Backend**:
  * Python 3.12+
  * FastAPI 0.141+
  * SQLAlchemy ORM 2.1+
  * SQLite 3 (`task_management.db`)
  * Pydantic v2 (Request/Response schemas)
  * PyJWT (Access token encoding/decoding)
  * pwdlib / PassLib (Argon2 / Bcrypt password hashing)
* **Frontend**:
  * React 19+
  * Vite 6+
  * Axios 1.7+
  * Vanilla CSS

---

## 🏗️ High-Level Architectural Boundaries

```
+-------------------------------------------------------+
|                    Browser / Client                   |
|  React 19 + Axios (Vite Dev Server http://localhost:5173)|
+-------------------------------------------------------+
                           |
              HTTPS / HTTP Rest API Calls
                           |
+-------------------------------------------------------+
|                    Backend API                        |
|  FastAPI Application (Uvicorn Server http://localhost:8000)|
|  - Auth Router (/api/auth)                            |
|  - Employee Router (/api/employees)                   |
|  - Task Router (Planned /api/tasks)                   |
+-------------------------------------------------------+
                           |
              SQLAlchemy ORM Data Engine
                           |
+-------------------------------------------------------+
|                 SQLite Database                       |
|  task_management.db (users, profiles, tasks, sessions)|
+-------------------------------------------------------+
```
