import os
from pathlib import Path

from dotenv import load_dotenv


# backend/ directory ka absolute path
BACKEND_DIR = Path(__file__).resolve().parents[2]

# backend/.env load karo
ENV_FILE = BACKEND_DIR / ".env"
load_dotenv(ENV_FILE)


def get_required_env(name: str) -> str:
    """
    Required environment variable load karta hai.
    Missing ho toh clear error deta hai.
    """
    value = os.getenv(name)

    if not value:
        raise RuntimeError(
            f"{name} is missing. Add it to backend/.env"
        )

    return value


def get_int_env(name: str, default: int) -> int:
    """
    Integer environment variable load karta hai.
    """
    value = os.getenv(name, str(default))

    try:
        return int(value)
    except ValueError as exc:
        raise RuntimeError(
            f"{name} must be an integer"
        ) from exc


def get_bool_env(name: str, default: bool = False) -> bool:
    """
    true/false environment variable parse karta hai.
    """
    value = os.getenv(name)

    if value is None:
        return default

    return value.strip().lower() in {"true", "1", "yes"}


JWT_SECRET_KEY = get_required_env("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = get_int_env(
    "ACCESS_TOKEN_EXPIRE_MINUTES",
    15,
)

REFRESH_TOKEN_EXPIRE_DAYS = get_int_env(
    "REFRESH_TOKEN_EXPIRE_DAYS",
    7,
)

REFRESH_COOKIE_NAME = os.getenv(
    "REFRESH_COOKIE_NAME",
    "task_refresh",
)

COOKIE_SECURE = get_bool_env("COOKIE_SECURE", False)
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax").lower()


if ACCESS_TOKEN_EXPIRE_MINUTES <= 0:
    raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES must be positive")

if REFRESH_TOKEN_EXPIRE_DAYS <= 0:
    raise RuntimeError("REFRESH_TOKEN_EXPIRE_DAYS must be positive")

if COOKIE_SAMESITE not in {"lax", "strict", "none"}:
    raise RuntimeError("COOKIE_SAMESITE must be lax, strict, or none")

if COOKIE_SAMESITE == "none" and not COOKIE_SECURE:
    raise RuntimeError(
        "COOKIE_SECURE must be true when COOKIE_SAMESITE is none"
    )