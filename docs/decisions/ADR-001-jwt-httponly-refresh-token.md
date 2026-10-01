# ADR-001: Short-lived Access Tokens with HttpOnly Refresh Token Rotation

* **Status**: Accepted
* **Date**: 2026-10-01
* **Context**: The system requires a secure authentication framework that minimizes vulnerability to Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) while providing immediate server-side revocation capabilities.

---

## 💡 Decision

1. **Short-Lived Access JWT**: Store in client memory and pass via `Authorization: Bearer <token>` headers (15-minute expiry).
2. **Opaque Refresh Token**: Deliver as an `HttpOnly`, `SameSite=Lax` cookie scoped to `/api/auth` (7-day expiry).
3. **Database Session Hashing**: Persist only SHA-256 hashes of refresh tokens in the `refresh_sessions` table.
4. **Token Rotation**: Every `/api/auth/refresh` request revokes the old session (`revoked_at = now`) and issues a brand-new refresh session and cookie.

---

## ⚖️ Consequences

* **Pros**:
  * JavaScript (XSS) cannot extract or leak the refresh token.
  * Stolen database dumps cannot be used to forge session tokens due to SHA-256 hashing.
  * Server maintains instant revocation power via `revoked_at` database flags.
* **Cons**:
  * Every refresh attempt requires a lightweight database lookup (`select(RefreshSession)`).
