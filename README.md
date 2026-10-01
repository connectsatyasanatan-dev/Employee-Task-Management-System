# Employee Task Management System

A robust, enterprise-ready web application for managing employees, task assignments, work statuses, and administrative oversight.

---

## 🚀 Quick Links & Documentation Index

* **[Documentation Index](file:///d:/Task-Management/docs/index.md)**
* **[Project Overview](file:///d:/Task-Management/docs/project/overview.md)**
* **[Feature Status & Inventory](file:///d:/Task-Management/docs/project/feature-status.md)**
* **[System Architecture](file:///d:/Task-Management/docs/architecture/system-overview.md)**
* **[Authentication & Security Architecture](file:///d:/Task-Management/docs/architecture/authentication-and-authorization.md)**
* **[API Documentation Index](file:///d:/Task-Management/docs/api/README.md)**
* **[Database Data Model](file:///d:/Task-Management/docs/database/data-model.md)**
* **[Local Setup & Development Guide](file:///d:/Task-Management/docs/development/local-setup.md)**
* **[Troubleshooting & Recovery Guide](file:///d:/Task-Management/docs/operations/troubleshooting.md)**

---

## 🛠️ Technology Stack

* **Backend**: Python 3.12+, FastAPI, SQLAlchemy ORM, SQLite, Pydantic v2, PyJWT, pwdlib (Argon2 / Bcrypt)
* **Frontend**: React 19+, Vite, Axios, Vanilla CSS
* **Authentication**: Short-lived JWT Access Tokens, Cryptographic SHA-256 Hashed Refresh Tokens in HttpOnly Cookies

---

## ⚡ Quick Start (Local Development)

### 1. Backend Setup
```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```
Interactive API documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```powershell
cd frontend
npm run dev
```
Development web application will be accessible at: `http://localhost:5173`

---

## 🔒 Security Policy
* Secrets and environment configurations must be managed via `backend/.env` (never committed to Git).
* Refer to the **[Security Checklist](file:///d:/Task-Management/docs/operations/security-checklist.md)** for detailed compliance requirements.
