# Security Controls & Compliance Checklist

This checklist tracks implemented security controls and upcoming security guidelines.

---

## ✅ Implemented Security Controls

- [x] **Password Hashing**: Passwords stored using `pwdlib` (`Argon2` / `Bcrypt`) with salt. Plaintext passwords never stored.
- [x] **SHA-256 Token Hashing**: Refresh tokens hashed with SHA-256 before database storage.
- [x] **HttpOnly Refresh Cookie**: Refresh tokens sent via `HttpOnly` cookie scoped to `path="/api/auth"` preventing JS/XSS access.
- [x] **Refresh Token Rotation (RTR)**: Old refresh sessions revoked upon token refresh; replacement session and cookie issued.
- [x] **Server-Side Session Revocation**: `/api/auth/logout` explicitly marks `revoked_at` in the database.
- [x] **Role-Based Access Control (RBAC)**: `require_admin` dependency enforces role permissions on admin endpoints.
- [x] **Prevent Privilege Escalation**: Employee creation and update endpoints explicitly disallow setting or changing user roles to `admin`.
- [x] **Generic Auth Error Messages**: Login endpoint returns generic `"Invalid email or password"` to prevent user email enumeration.

---

## ⏳ Planned Security Enhancements

- [ ] Enforce `COOKIE_SECURE=true` in production HTTPS deployments.
- [ ] Add rate-limiting middleware (`slowapi`) on `/api/auth/login` to mitigate brute-force password guessing.
- [ ] Add CSRF double-submit token headers for non-GET requests if cross-site cookie usage is expanded.
