from datetime import datetime, timezone
from typing import Annotated, Optional

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_admin
from app.core.config import (
    COOKIE_SAMESITE,
    COOKIE_SECURE,
    REFRESH_COOKIE_NAME,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_refresh_token_expiry,
    hash_refresh_token,
    verify_password,
)
from app.db.database import get_db
from app.models.refresh_session import RefreshSession
from app.models.user import User
from app.schemas.user import TokenResponse, UserLogin, UserResponse


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
def login(
    login_data: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
):
    # 1. Find user by email, case-insensitively.
    statement = select(User).where(
        func.lower(User.email) == login_data.email.lower()
    )
    user = db.scalar(statement)

    # 2. Use a generic error so the response doesn't reveal
    # whether the email exists.
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if user is None:
        raise invalid_credentials

    # 3. Verify entered password against stored password hash.
    if not verify_password(login_data.password, user.password_hash):
        raise invalid_credentials

    # 4. Reject disabled accounts.
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive",
        )

    # 5. Create short-lived access JWT.
    access_token = create_access_token(user.id)

    # 6. Create a new opaque refresh token.
    raw_refresh_token = create_refresh_token()
    refresh_token_hash = hash_refresh_token(raw_refresh_token)

    # 7. Store only the hash in the database.
    refresh_session = RefreshSession(
        user_id=user.id,
        token_hash=refresh_token_hash,
        expires_at=get_refresh_token_expiry(),
    )

    db.add(refresh_session)
    db.commit()

    # 8. Set refresh token as an HttpOnly cookie.
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=raw_refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/api/auth",
    )

    # 9. Return access token and safe user details.
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
def refresh_token(
    response: Response,
    task_refresh: Annotated[
        Optional[str], Cookie(alias=REFRESH_COOKIE_NAME)
    ] = None,
    db: Session = Depends(get_db),
):
    """
    Issue a new access token and rotate the refresh token cookie.
    """
    if not task_refresh:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 1. Hash incoming refresh token
    token_hash = hash_refresh_token(task_refresh)

    # 2. Find refresh session in database
    statement = select(RefreshSession).where(
        RefreshSession.token_hash == token_hash
    )
    session = db.scalar(statement)

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Check if session is revoked
    if session.revoked_at is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 4. Check if session is expired
    now = datetime.now(timezone.utc)
    expires_at = session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 5. Verify associated user is active
    user = session.user
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive",
        )

    # 6. Rotate refresh token: revoke current session
    session.revoked_at = now

    # 7. Create new refresh session
    new_raw_refresh_token = create_refresh_token()
    new_token_hash = hash_refresh_token(new_raw_refresh_token)

    new_session = RefreshSession(
        user_id=user.id,
        token_hash=new_token_hash,
        expires_at=get_refresh_token_expiry(),
    )

    db.add(new_session)
    db.commit()

    # 8. Set rotated refresh token cookie
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=new_raw_refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/api/auth",
    )

    # 9. Generate fresh access token
    access_token = create_access_token(user.id)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
)
def logout(
    response: Response,
    task_refresh: Annotated[
        Optional[str], Cookie(alias=REFRESH_COOKIE_NAME)
    ] = None,
    db: Session = Depends(get_db),
):
    """
    Revoke the active refresh token session and clear the refresh cookie.
    """
    if task_refresh:
        token_hash = hash_refresh_token(task_refresh)
        statement = select(RefreshSession).where(
            RefreshSession.token_hash == token_hash,
            RefreshSession.revoked_at.is_(None),
        )
        session = db.scalar(statement)

        if session:
            session.revoked_at = datetime.now(timezone.utc)
            db.commit()

    # Clear refresh cookie
    response.delete_cookie(
        key=REFRESH_COOKIE_NAME,
        path="/api/auth",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
    )

    return {"message": "Successfully logged out"}


@router.get(
    "/me",
    response_model=UserResponse,
)
def read_current_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Return the currently authenticated user's safe profile.
    """
    return current_user


@router.get(
    "/admin-check",
    response_model=UserResponse,
)
def admin_check(
    current_admin: Annotated[User, Depends(require_admin)],
):
    """
    Example endpoint accessible only to admins.
    """
    return current_admin