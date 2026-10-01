from getpass import getpass

from sqlalchemy import func, select

from app.core.security import hash_password
from app.db.database import Base, SessionLocal, engine
from app.models import User


def seed_admin():
    # Ensure registered model tables exist.
    Base.metadata.create_all(bind=engine)

    print("\n=== Create Initial Admin ===")

    name = input("Admin name: ").strip()
    email = input("Admin email: ").strip().lower()

    if not name:
        print("Name cannot be empty.")
        return

    if not email or "@" not in email:
        print("Enter a valid email address.")
        return

    password = getpass("Admin password (minimum 8 characters): ")
    confirm_password = getpass("Confirm password: ")

    if len(password) < 8:
        print("Password must contain at least 8 characters.")
        return

    if password != confirm_password:
        print("Passwords do not match.")
        return

    db = SessionLocal()

    try:
        existing_user = db.scalar(
            select(User).where(
                func.lower(User.email) == email
            )
        )

        if existing_user:
            print("A user with this email already exists.")
            print("No account was created or modified.")
            return

        admin = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("\nAdmin created successfully.")
        print(f"Admin ID: {admin.id}")
        print(f"Admin email: {admin.email}")
        print("Role: admin")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()