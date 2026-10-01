# Backend Architecture — FastAPI & SQLAlchemy

## 📁 Directory & Subsystem Organization

The backend is structured under `backend/app` using a modular layered pattern:

```text
backend/app/
├── api/
│   ├── dependencies.py       # FastAPI dependencies (get_db, get_current_user, require_admin)
│   └── routes/
│       ├── auth.py           # Login, refresh, logout, /me endpoints
│       └── employees.py      # Employee CRUD & status endpoints
├── core/
│   ├── config.py             # Environment configuration & parser
│   └── security.py           # Password hashing, JWT token creation/decoding, SHA-256 hashing
├── db/
│   └── database.py           # SQLAlchemy engine, SessionLocal factory, get_db dependency
├── models/                   # SQLAlchemy ORM models
│   ├── user.py
│   ├── employee_profile.py
│   ├── task.py
│   └── refresh_session.py
└── schemas/                  # Pydantic v2 schemas
    ├── user.py
    ├── employee.py
    └── task.py
```

---

## 🗄️ Database Session Lifecycle

1. **Engine Setup**: [`database.py`](file:///d:/Task-Management/backend/app/db/database.py) initializes SQLAlchemy `create_engine` pointing to `sqlite:///./task_management.db` with `connect_args={"check_same_thread": False}`.
2. **Session Injection**: Route handlers request database sessions using `db: Session = Depends(get_db)`.
3. **Transaction Context**: `get_db()` yields a thread-local session wrapped in a `try...finally` block that guarantees `db.close()` is called after every request.
