# Environment Variables Reference

All environment variables used by the application are documented below.

> [!WARNING]
> Never commit actual secret keys, passwords, or production `.env` files to Git. Production secrets must be injected via secure secret managers.

---

## ⚙️ Backend Environment Variables (`backend/.env`)

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `JWT_SECRET_KEY` | **Yes** | *None* | Secret key used for signing and verifying JWT access tokens. Must be a long random string. |
| `JWT_ALGORITHM` | No | `"HS256"` | Cryptographic algorithm used for JWT signing. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `15` | Lifetime duration (in minutes) for short-lived access JWT tokens. |
| `REFRESH_TOKEN_EXPIRE_DAYS` | No | `7` | Lifetime duration (in days) for refresh token sessions. |
| `REFRESH_COOKIE_NAME` | No | `"task_refresh"` | Name of the HttpOnly cookie used for refresh token delivery. |
| `COOKIE_SECURE` | No | `False` | Set to `true` in production HTTPS environments to enforce HTTPS-only cookie transmission. |
| `COOKIE_SAMESITE` | No | `"lax"` | SameSite cookie policy (`"lax"`, `"strict"`, or `"none"`). |

---

## 💻 Frontend Environment Variables (`frontend/.env`)

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | No | `http://localhost:8000` | Base URL used by Axios client to send API requests to the FastAPI backend. |
