# Troubleshooting & Recovery Runbook

This runbook provides safe, non-destructive diagnostic procedures and fixes for common startup, database, authentication, and network issues.

---

## 🔍 Issue 1: Backend Fails to Start (`JWT_SECRET_KEY is missing`)

* **Symptom**: Server startup aborts with `RuntimeError: JWT_SECRET_KEY is missing. Add it to backend/.env`.
* **Cause**: `backend/.env` does not exist or lacks the required `JWT_SECRET_KEY` definition.
* **Fix Steps**:
  1. Open `backend/.env` (create file if missing).
  2. Add key definition: `JWT_SECRET_KEY=your_secure_random_key_here`.
  3. Restart Uvicorn server.

---

## 🔍 Issue 2: HTTP 401 Unauthorized on API Requests

* **Symptom**: API endpoints return `{"detail": "Invalid or expired access token"}`.
* **Cause**: Access JWT has passed its 15-minute lifetime window or header is formatted incorrectly.
* **Fix Steps**:
  1. Ensure header is formatted as `Authorization: Bearer <token>` (with exact space).
  2. If expired, send a request to `POST /api/auth/refresh` to obtain a fresh access token using your valid `task_refresh` cookie.

---

## 🔍 Issue 3: HTTP 403 Forbidden on Employee Admin Endpoints

* **Symptom**: API returns `{"detail": "Admin access required"}`.
* **Cause**: The authenticated user account has `role: "employee"` instead of `role: "admin"`.
* **Fix Steps**:
  1. Authenticate with an administrator user account.
  2. Run `scripts/seed_admin.py` to seed an admin user if no admin exists.

---

## 🔍 Issue 4: CORS Errors on Frontend Requests

* **Symptom**: Browser console logs `Access-Control-Allow-Origin` CORS errors.
* **Cause**: Frontend port does not match allowed origins configured in [`main.py`](file:///d:/Task-Management/backend/app/main.py#L23).
* **Fix Steps**:
  1. Check Vite frontend URL (default: `http://localhost:5173`).
  2. Ensure `allow_origins=["http://localhost:5173"]` in `main.py` matches your client domain.
