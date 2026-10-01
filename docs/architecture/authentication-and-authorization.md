# Authentication & Authorization Architecture

## 🔑 Session & Token Architecture

The system uses a hybrid authentication model combining short-lived **JWT Access Tokens** with secure **HttpOnly Refresh Cookies**:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React SPA
    participant AuthAPI as FastAPI /api/auth
    participant DB as SQLite DB

    User->>Client: Submit Email & Password
    Client->>AuthAPI: POST /api/auth/login
    AuthAPI->>DB: Query User & Verify Password Hash
    AuthAPI->>AuthAPI: Generate Access JWT & Opaque Refresh Token
    AuthAPI->>DB: Insert SHA-256(Refresh Token) Session
    AuthAPI-->>Client: 200 OK + Access Token JSON + HttpOnly Cookie (task_refresh)

    Note over Client,AuthAPI: Subsequent API Requests
    Client->>AuthAPI: GET /api/employees (Header: Bearer Access JWT)
    AuthAPI->>AuthAPI: Decode JWT & Verify Expiry/Role
    AuthAPI-->>Client: 200 OK Data Response

    Note over Client,AuthAPI: Access Token Expired (Refresh Flow)
    Client->>AuthAPI: POST /api/auth/refresh (Cookie: task_refresh)
    AuthAPI->>DB: Validate SHA-256 Token Hash & Check Revocation/Expiry
    AuthAPI->>DB: Revoke Old Session & Insert New Session (Rotation)
    AuthAPI-->>Client: 200 OK + New Access Token + Rotated HttpOnly Cookie
```

---

## 🛡️ Key Security Features Implemented

1. **Password Protection**: Plaintext passwords are never stored. Passwords are hashed using `pwdlib` (`Argon2`/`Bcrypt`).
2. **Refresh Token Hashing**: Opaque refresh tokens are generated via `secrets.token_urlsafe(48)`. Only their SHA-256 hash is persisted in the database.
3. **Cookie Hardening**: Refresh tokens are stored in `HttpOnly` cookies (`path="/api/auth"`), preventing client-side JavaScript (XSS) from reading them.
4. **Token Rotation**: Every call to `/api/auth/refresh` revokes the old session and issues a new refresh token.
5. **Role-Based Access Control (RBAC)**: Enforced via `require_admin` dependency in [`dependencies.py`](file:///d:/Task-Management/backend/app/api/dependencies.py#L54-L63).
