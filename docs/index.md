# Employee Task Management System — Documentation Index

Welcome to the central documentation hub for the Employee Task Management System. This documentation is maintained alongside code as version-controlled engineering artifacts.

---

## 📚 Document Catalogue

### 1. Project & Requirements
* **[Project Overview](file:///d:/Task-Management/docs/project/overview.md)**: Purpose, target personas, core capabilities, technology stack, and high-level boundaries.
* **[Goals & Scope](file:///d:/Task-Management/docs/project/goals-and-scope.md)**: Product scope, explicit non-goals, and boundary constraints.
* **[Feature Implementation Status](file:///d:/Task-Management/docs/project/feature-status.md)**: Evidence-based inventory of implemented, partial, and planned features with IDs.

### 2. Architecture & Design
* **[System Overview Architecture](file:///d:/Task-Management/docs/architecture/system-overview.md)**: Layered system architecture, request processing pipeline, and sequence diagrams.
* **[Backend Architecture](file:///d:/Task-Management/docs/architecture/backend-architecture.md)**: FastAPI structure, ORM configuration, database session handling, and router registration.
* **[Frontend Architecture](file:///d:/Task-Management/docs/architecture/frontend-architecture.md)**: React components, Vite configuration, Axios API client setup, and current UI state.
* **[Authentication & Security Architecture](file:///d:/Task-Management/docs/architecture/authentication-and-authorization.md)**: JWT access tokens, HttpOnly refresh session rotation, RBAC, and hashing standards.

### 3. API Specifications
* **[API Documentation Overview](file:///d:/Task-Management/docs/api/README.md)**: OpenAPI specification integration, error formats, and response standards.
* **[Authentication API](file:///d:/Task-Management/docs/api/authentication.md)**: `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`, and `GET /admin-check`.
* **[Employee Management API](file:///d:/Task-Management/docs/api/employees.md)**: `GET /employees`, `POST /employees`, `GET /employees/{id}`, `PUT /employees/{id}`, `PATCH /employees/{id}/status`.
* **[Task Management API (Planned)](file:///d:/Task-Management/docs/api/tasks.md)**: Proposed specification for task creation, assignment, status tracking, and filtering.

### 4. Database & Storage
* **[Data Model & Schema](file:///d:/Task-Management/docs/database/data-model.md)**: Tables (`users`, `employee_profiles`, `tasks`, `refresh_sessions`), primary/foreign keys, indexes, and constraints.

### 5. Developer & Operations Guides
* **[Local Setup Guide](file:///d:/Task-Management/docs/development/local-setup.md)**: Step-by-step setup instructions for backend and frontend local development.
* **[Environment Variables Reference](file:///d:/Task-Management/docs/development/environment-variables.md)**: Configuration parameters for backend and frontend environments.
* **[Testing & Manual Verification](file:///d:/Task-Management/docs/development/testing.md)**: Verification steps for API routes and authentication flows.
* **[Test Accounts & Sample Data](file:///d:/Task-Management/docs/development/test-credentials.md)**: Ready-to-use testing credentials, employee profiles, and sample task inventory.
* **[Troubleshooting & Recovery Runbook](file:///d:/Task-Management/docs/operations/troubleshooting.md)**: Diagnosing startup errors, database locks, CORS issues, and 401/403 status codes.
* **[Security Checklist](file:///d:/Task-Management/docs/operations/security-checklist.md)**: Security verification checklist and compliance guidelines.

### 6. Decision Records & Changelog
* **[Architecture Decision Records (ADRs)](file:///d:/Task-Management/docs/decisions/README.md)**: Index of technical decisions and architectural rationale.
* **[ADR-001: JWT + HttpOnly Refresh Token Rotation](file:///d:/Task-Management/docs/decisions/ADR-001-jwt-httponly-refresh-token.md)**: Rationale behind session management design.
* **[Changelog](file:///d:/Task-Management/docs/releases/CHANGELOG.md)**: Historical tracking of additions, changes, and fixes.
