from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from typing import Annotated

from fastapi import Depends

from app.api.dependencies import get_current_user, require_admin
from app.models.user import User
from app.schemas.user import UserResponse

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