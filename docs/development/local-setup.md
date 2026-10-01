# Local Development Setup Guide

Follow this step-by-step guide to run and develop the Employee Task Management System locally.

---

## 📋 Prerequisites

* **Python**: 3.12 or higher
* **Node.js**: 18.0 or higher
* **npm**: 9.0 or higher
* **Git**: Installed and configured

---

## 🐍 Backend Local Setup

### 1. Navigate to Backend Directory
```powershell
cd D:\Task-Management\backend
```

### 2. Virtual Environment Verification
Verify that `.venv` exists. If initializing for the first time:
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Environment Variables Configuration
Ensure `backend/.env` exists. If missing, create `backend/.env` based on `backend/.env.example`:
```env
JWT_SECRET_KEY=change-this-to-a-secure-random-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
REFRESH_COOKIE_NAME=task_refresh
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

### 4. Seed Initial Administrator Account
Run the interactive CLI seed script to create your first `admin` user:
```powershell
.venv\Scripts\python.exe scripts/seed_admin.py
```
Follow prompts to enter admin name, email, and password.

### 5. Start Backend Server
```powershell
.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```
Backend API server will run at: `http://localhost:8000`  
Swagger UI will be accessible at: `http://localhost:8000/docs`

---

## ⚡ Frontend Local Setup

### 1. Navigate to Frontend Directory
```powershell
cd D:\Task-Management\frontend
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Start Frontend Development Server
```powershell
npm run dev
```
Frontend web application will run at: `http://localhost:5173`
