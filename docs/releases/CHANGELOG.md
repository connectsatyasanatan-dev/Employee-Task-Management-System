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
- Established version-controlled documentation suite under `docs/`.

---

## [1.0.0] - Initial Setup

### Added
- Core FastAPI backend setup with SQLAlchemy SQLite database binding.
- Initial models: `User`, `EmployeeProfile`, `Task`, `RefreshSession`.
- Authentication routes: `POST /login`, `GET /me`, `GET /admin-check`.
- CLI script `scripts/seed_admin.py` for creating initial administrator accounts.
- React + Vite + Axios frontend workspace template.
