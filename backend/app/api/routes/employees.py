import math
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.core.security import hash_password
from app.db.database import get_db
from app.models.employee_profile import EmployeeProfile
from app.models.user import User
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeStatusUpdate,
    EmployeeUpdate,
    PaginatedEmployeeResponse,
)

router = APIRouter(
    prefix="/api/employees",
    tags=["Employee Management"],
)


@router.get(
    "",
    response_model=PaginatedEmployeeResponse,
    status_code=status.HTTP_200_OK,
)
def list_employees(
    page: Annotated[int, Query(ge=1, description="Page number")] = 1,
    page_size: Annotated[
        int, Query(ge=1, le=100, description="Items per page")
    ] = 10,
    search: Annotated[
        Optional[str], Query(description="Search by name or email")
    ] = None,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    List all employees with optional search filtering and pagination. Admin only.
    """
    statement = (
        select(User)
        .outerjoin(User.employee_profile)
        .where(User.role == "employee")
    )

    if search and search.strip():
        search_pattern = f"%{search.strip().lower()}%"
        statement = statement.where(
            or_(
                func.lower(User.name).like(search_pattern),
                func.lower(User.email).like(search_pattern),
            )
        )

    # Count total records
    count_statement = select(func.count()).select_from(statement.subquery())
    total = db.scalar(count_statement) or 0

    # Paginate results
    offset = (page - 1) * page_size
    paginated_statement = (
        statement.order_by(User.id.desc()).offset(offset).limit(page_size)
    )
    users = db.scalars(paginated_statement).all()

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    items = [EmployeeResponse.from_user(user) for user in users]

    return PaginatedEmployeeResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_employee(
    employee_data: EmployeeCreate,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Create a new employee user and profile in a single database transaction. Admin only.
    """
    # 1. Check duplicate email
    existing_user = db.scalar(
        select(User).where(
            func.lower(User.email) == employee_data.email.lower().strip()
        )
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An employee with this email already exists",
        )

    try:
        # 2. Create User record (role forced to employee)
        new_user = User(
            name=employee_data.name.strip(),
            email=employee_data.email.lower().strip(),
            password_hash=hash_password(employee_data.password),
            role="employee",
            is_active=True,
        )
        db.add(new_user)
        db.flush()

        # 3. Create related EmployeeProfile record
        profile = EmployeeProfile(
            user_id=new_user.id,
            phone=employee_data.phone.strip(),
            department=employee_data.department.strip(),
            designation=employee_data.designation.strip(),
            status="active",
        )
        db.add(profile)
        db.commit()
        db.refresh(new_user)

        return EmployeeResponse.from_user(new_user)

    except Exception:
        db.rollback()
        raise


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
    status_code=status.HTTP_200_OK,
)
def get_employee(
    employee_id: int,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Get detailed information for a specific employee. Admin only.
    """
    user = db.scalar(
        select(User).where(User.id == employee_id, User.role == "employee")
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    return EmployeeResponse.from_user(user)


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse,
    status_code=status.HTTP_200_OK,
)
def update_employee(
    employee_id: int,
    update_data: EmployeeUpdate,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Update details of an existing employee. Admin only.
    """
    user = db.scalar(
        select(User).where(User.id == employee_id, User.role == "employee")
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    # Check email conflict if email is updated
    if update_data.email and update_data.email.lower().strip() != user.email:
        conflict_user = db.scalar(
            select(User).where(
                func.lower(User.email) == update_data.email.lower().strip(),
                User.id != employee_id,
            )
        )
        if conflict_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An employee with this email already exists",
            )
        user.email = update_data.email.lower().strip()

    if update_data.name is not None:
        user.name = update_data.name.strip()

    # Update or create profile
    profile = user.employee_profile
    if profile is None:
        profile = EmployeeProfile(
            user_id=user.id,
            phone=update_data.phone.strip() if update_data.phone else "",
            department=update_data.department.strip() if update_data.department else "",
            designation=update_data.designation.strip() if update_data.designation else "",
            status="active" if user.is_active else "inactive",
        )
        db.add(profile)
    else:
        if update_data.phone is not None:
            profile.phone = update_data.phone.strip()
        if update_data.department is not None:
            profile.department = update_data.department.strip()
        if update_data.designation is not None:
            profile.designation = update_data.designation.strip()

    db.commit()
    db.refresh(user)

    return EmployeeResponse.from_user(user)


@router.patch(
    "/{employee_id}/status",
    response_model=EmployeeResponse,
    status_code=status.HTTP_200_OK,
)
def update_employee_status(
    employee_id: int,
    status_data: EmployeeStatusUpdate,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Activate or deactivate an employee. Admin only.
    """
    user = db.scalar(
        select(User).where(User.id == employee_id, User.role == "employee")
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    user.is_active = status_data.is_active

    profile = user.employee_profile
    if profile:
        profile.status = "active" if status_data.is_active else "inactive"

    db.commit()
    db.refresh(user)

    return EmployeeResponse.from_user(user)


@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_200_OK,
)
def delete_employee(
    employee_id: int,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Permanently delete an employee user and all associated profile data. Admin only.
    """
    user = db.scalar(
        select(User).where(User.id == employee_id, User.role == "employee")
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    db.delete(user)
    db.commit()

    return {"message": "Employee deleted successfully"}
