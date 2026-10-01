# Changelog — Employee Task Management System

All notable changes to this project are documented in this file.

---

## [Unreleased]

### Added
- Implemented `POST /api/auth/refresh` endpoint for issuing new access tokens and rotating `task_refresh` HttpOnly cookies.
- Implemented `POST /api/auth/logout` endpoint for revoking refresh sessions in DB and clearing client cookies.
- Implemented Employee Management API endpoints under `/api/employees`:
  - `GET /api/employees` (Paginated listing with search filter)
  - `POST /api/employees` (Atomic `User` and `EmployeeProfile` creation)
  - `GET /api/employees/{employee_id}` (Employee detail view)
  - `PUT /api/employees/{employee_id}` (Employee profile updates)
  - `PATCH /api/employees/{employee_id}/status` (Soft activation/deactivation)
- Implemented Task Management API endpoints under `/api/tasks`:
  - `GET /api/tasks` (Paginated listing with status/priority filters; role-scoped for employees)
  - `POST /api/tasks` (Admin task creation with assignee & date validation)
  - `GET /api/tasks/{task_id}` (Detail view with role-based access isolation)
  - `PUT /api/tasks/{task_id}` (Admin update of task details, assignee, dates)
  - `PATCH /api/tasks/{task_id}/status` (Status update for Admin or assigned Employee)
  - `DELETE /api/tasks/{task_id}` (Admin task deletion)
- Implemented Dashboard Analytics API under `/api/dashboard`:
  - `GET /api/dashboard/stats` (Real-time count metrics for total employees, total tasks, pending, in-progress, completed, and overdue tasks)
- Implemented Phase 1 Frontend Foundation under `frontend/src`:
  - Shared Axios client with Bearer token request interceptor and 401 auto-refresh response interceptor.
  - Dedicated API service modules (`authApi.js`, `employeeApi.js`, `taskApi.js`, `dashboardApi.js`).
  - Global `AuthContext` provider & `useAuth` hook managing in-memory tokens, session restoration, and login/logout methods.
  - React Router DOM 7 setup with `<ProtectedRoute>`, `<AppLayout>` responsive application shell, and role-based route guards.
  - Polished Light Theme design system tokens (`index.css`) and responsive layout utility CSS (`App.css`).
  - Production-ready `LoginPage` with form validation, loading states, and backend error handling.
- Implemented Dashboard UI phase (`DashboardPage.jsx`, `StatCard.jsx`, `TaskDistributionChart.jsx`, `RecentTasksTable.jsx`):
  - Role-aware metrics grid isolating Admin (`total_employees`, `total_tasks`) and Employee views.
  - Recharts task distribution pie chart with accessible textual summary & status badges.
  - Role-scoped recent 5 tasks table fetched via centralized `taskApi.js`.
  - Loading skeleton states, empty states, and user-recoverable retry error handling.
  - Responsive reflows for desktop (1440px/1024px), tablet (768px), and mobile (375px) viewports.
- Established version-controlled documentation suite under `docs/`.

---

## [1.0.0] - Initial Setup

### Added
- Core FastAPI backend setup with SQLAlchemy SQLite database binding.
- Initial models: `User`, `EmployeeProfile`, `Task`, `RefreshSession`.
- Authentication routes: `POST /login`, `GET /me`, `GET /admin-check`.
- CLI script `scripts/seed_admin.py` for creating initial administrator accounts.
- React + Vite + Axios frontend workspace template.
