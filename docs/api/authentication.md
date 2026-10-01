# Authentication API Specification

Base Path: `/api/auth`  
Feature ID: `AUTH-001` - `AUTH-005`

---

## 1. POST `/api/auth/login`
* **Purpose**: Authenticate user credentials and return an access JWT alongside an HttpOnly refresh cookie.
* **Auth Requirement**: None (Public)
* **Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```
* **Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "System Admin",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true
  }
}
```
* **Set-Cookie Header**: `task_refresh=<opaque_token>; Path=/api/auth; HttpOnly; SameSite=Lax`
* **Error Responses**:
  * `401 Unauthorized`: `"Invalid email or password"`
  * `403 Forbidden`: `"This account is inactive"`

---

## 2. POST `/api/auth/refresh`
* **Purpose**: Issue a new short-lived access JWT and rotate the refresh token cookie.
* **Auth Requirement**: `task_refresh` HttpOnly cookie.
* **Request Body**: None
* **Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "System Admin",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true
  }
}
```
* **Error Responses**:
  * `401 Unauthorized`: `"Refresh token missing"` / `"Invalid refresh token"` / `"Refresh token has been revoked"` / `"Refresh token has expired"`

---

## 3. POST `/api/auth/logout`
* **Purpose**: Invalidate active refresh session in database and clear client refresh cookie.
* **Auth Requirement**: Optional `task_refresh` cookie.
* **Response (200 OK)**:
```json
{
  "message": "Successfully logged out"
}
```

---

## 4. GET `/api/auth/me`
* **Purpose**: Retrieve profile details of currently authenticated user.
* **Auth Requirement**: `Authorization: Bearer <access_token>`
* **Response (200 OK)**:
```json
{
  "id": 1,
  "name": "System Admin",
  "email": "admin@example.com",
  "role": "admin",
  "is_active": true
}
```

---

## 5. GET `/api/auth/admin-check`
* **Purpose**: Verification route accessible exclusively to admins.
* **Auth Requirement**: `Authorization: Bearer <access_token>` (Role: `admin`)
* **Response (200 OK)**: User profile object.
* **Error Response**: `403 Forbidden` (`"Admin access required"`).
