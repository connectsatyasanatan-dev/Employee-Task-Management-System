import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from app.core.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    JWT_ALGORITHM,
    JWT_SECRET_KEY,
)


password_hash = PasswordHash.recommended()


# -------------------------
# Password hashing
# -------------------------

def hash_password(password: str) -> str:
    """
    Plain password ko secure password hash mein convert karta hai.
    Database mein plain password kabhi store nahi karna.
    """
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    stored_hash: str,
) -> bool:
    """
    Login ke waqt entered password ko database hash se verify karta hai.
    """
    return password_hash.verify(plain_password, stored_hash)


# -------------------------
# Access JWT
# -------------------------

def create_access_token(user_id: int) -> str:
    """
    Short-lived access JWT create karta hai.
    """
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> dict:
    """
    JWT signature, expiry aur token type verify karta hai.
    Invalid/expired token par PyJWT exception raise karega.
    """
    payload = jwt.decode(
        token,
        JWT_SECRET_KEY,
        algorithms=[JWT_ALGORITHM],
    )

    if payload.get("type") != "access":
        raise jwt.InvalidTokenError("Invalid token type")

    if not payload.get("sub"):
        raise jwt.InvalidTokenError("Token subject is missing")

    return payload


# -------------------------
# Refresh token
# -------------------------

def create_refresh_token() -> str:
    """
    Cryptographically secure random refresh token.
    Ye JWT nahi hai; opaque random credential hai.
    """
    return secrets.token_urlsafe(48)


def hash_refresh_token(token: str) -> str:
    """
    Refresh token ka SHA-256 hash banata hai.
    Database mein raw token ke bajay ye hash store hoga.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def get_refresh_token_expiry() -> datetime:
    """
    Refresh token ki expiry UTC datetime mein return karta hai.
    """
    from app.core.config import REFRESH_TOKEN_EXPIRE_DAYS

    return datetime.now(timezone.utc) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )