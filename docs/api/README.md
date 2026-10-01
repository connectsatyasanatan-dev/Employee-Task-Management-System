# API Specifications Overview

Welcome to the API specification documentation for the Employee Task Management System.

---

## 🌐 OpenAPI / Swagger Interactive Documentation

When the backend application is running locally, interactive OpenAPI documentation and live request testing are available at:

* **Swagger UI**: `http://localhost:8000/docs`
* **ReDoc**: `http://localhost:8000/redoc`
* **OpenAPI Schema (JSON)**: `http://localhost:8000/openapi.json`

---

## 📋 API Subsystem Documentation

1. **[Authentication API](file:///d:/Task-Management/docs/api/authentication.md)**: Login, token refresh, logout, profile view, and admin verification routes.
2. **[Employee Management API](file:///d:/Task-Management/docs/api/employees.md)**: Admin CRUD, search, pagination, and status toggling routes.
3. **[Task Management API (Planned)](file:///d:/Task-Management/docs/api/tasks.md)**: Specification for proposed task endpoints.

---

## ⚠️ Standard HTTP Error Responses

All API endpoints return standard HTTP status codes and JSON error responses formatted as follows:

```json
{
  "detail": "Error description message"
}
```

Common status codes:
* `400 Bad Request`: Invalid payload syntax or validation error.
* `401 Unauthorized`: Missing or expired access/refresh token.
* `403 Forbidden`: Insufficient permissions (e.g. non-admin accessing admin route).
* `404 Not Found`: Target entity does not exist.
* `409 Conflict`: Resource state conflict (e.g. duplicate email address).
* `422 Unprocessable Entity`: Pydantic input validation failure.
