from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.models.user import User


class EmployeeCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    phone: str = Field(min_length=7, max_length=20)
    department: str = Field(min_length=2, max_length=100)
    designation: str = Field(min_length=2, max_length=100)


class EmployeeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=7, max_length=20)
    department: Optional[str] = Field(None, min_length=2, max_length=100)
    designation: Optional[str] = Field(None, min_length=2, max_length=100)


class EmployeeStatusUpdate(BaseModel):
    is_active: bool


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    phone: str
    department: str
    designation: str
    status: str
    created_at: datetime

    @classmethod
    def from_user(cls, user: User) -> "EmployeeResponse":
        profile = user.employee_profile
        return cls(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
            phone=profile.phone if profile else "",
            department=profile.department if profile else "",
            designation=profile.designation if profile else "",
            status=profile.status if profile else ("active" if user.is_active else "inactive"),
            created_at=user.created_at,
        )


class PaginatedEmployeeResponse(BaseModel):
    items: list[EmployeeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int