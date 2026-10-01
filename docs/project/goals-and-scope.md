# Project Goals & Scope

## 🎯 In-Scope Requirements

1. **Authentication & Session Security**:
   * Secure credential login with generic error messages preventing user enumeration.
   * Short-lived JWT Access Tokens passed via `Authorization: Bearer` headers.
   * Cryptographically secure opaque refresh tokens delivered via `HttpOnly`, `SameSite`, `Secure` cookies.
   * SHA-256 hashed refresh session storage in database with explicit revocation and expiry checks.
   * Session rotation on token refresh to prevent token replay attacks.
   * Full server-side logout revoking sessions and clearing client cookies.

2. **Employee Profile Management**:
   * Single-transaction atomic creation of `User` and `EmployeeProfile` entities.
   * Administrative search and pagination for employee records.
   * Profile updating with duplicate email validation.
   * Soft activation/deactivation of employees to preserve historical records and task assignments.

3. **Task Management (Planned Phase)**:
   * Creation of tasks with title, description, start date, due date, and priority level.
   * Task assignment to active employees.
   * Filtered and paginated list views based on status, priority, and assignee.
   * Status transition updates by assigned employees.

---

## 🚫 Non-Goals & Out-of-Scope Items

* **No Self-Registration**: Employee accounts can only be created by an authenticated `admin`. Public sign-up is explicitly disallowed.
* **No Hard Deletion**: Employee profiles and assigned tasks must never be permanently deleted from database tables; soft deactivation is enforced.
* **No Direct Role Escalation**: Neither employee creation nor update endpoints permit clients to grant `admin` privileges.
* **No Plaintext Credential Storage**: Raw passwords and raw refresh tokens must never be written to database storage or log outputs.
