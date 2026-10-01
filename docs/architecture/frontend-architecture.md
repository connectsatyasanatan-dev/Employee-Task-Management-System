# Frontend Architecture — React & Vite

## 🛠️ Stack & Current Implementation Status

* **Build Tool**: Vite 8.3+
* **UI Framework**: React 19.2+
* **Routing**: React Router DOM 7.18+
* **HTTP Client**: Axios 1.20+
* **Icons**: Lucide React 1.48+
* **Charts**: Recharts 3.10+
* **Theme**: Polished Light Theme Design System

---

## 📁 Source Code Organization (`frontend/src/`)

```text
frontend/src/
├── api/
│   ├── client.js             # Shared Axios instance with Bearer token & 401 refresh interceptors
│   ├── authApi.js            # Login, logout, refresh, getMe API service
│   ├── employeeApi.js        # Employee CRUD & status API service
│   ├── taskApi.js            # Task CRUD, filters, & status API service
│   └── dashboardApi.js       # Dashboard analytics stats API service
├── context/
│   └── AuthContext.jsx       # Auth state provider (in-memory token, user, login, logout, session restoration)
├── hooks/
│   └── useAuth.js            # Custom hook consuming AuthContext
├── components/
│   └── layout/
│       ├── ProtectedRoute.jsx # Authentication & role guard wrapper component
│       └── AppLayout.jsx      # Light theme layout shell with header, sidebar, user profile badge, & outlet
└── pages/
    ├── LoginPage.jsx         # Light-theme login card view
    ├── DashboardPage.jsx     # Dashboard view placeholder
    ├── EmployeesPage.jsx     # Employee directory view placeholder
    ├── TasksPage.jsx         # Task management view placeholder
    └── NotFoundPage.jsx      # 404 Fallback page view
```

---

## 🔒 Authentication & Token Handling

1. **In-Memory Token Storage**: Access tokens are kept exclusively in JavaScript memory (`setInMemoryToken` helper & `useState` in `AuthContext.jsx`). Tokens are never written to `localStorage` or `sessionStorage`.
2. **Session Restoration**: On initial application load, `AuthContext` calls `authApi.refresh()` to restore session data via `task_refresh` HttpOnly cookie.
3. **Axios Interceptors**:
   - **Request Interceptor**: Automatically attaches `Authorization: Bearer <in_memory_token>` header on API requests.
   - **Response Interceptor**: Intercepts HTTP 401 Unauthorized responses (excluding login/refresh routes), invokes `/api/auth/refresh` to obtain a new access token, updates in-memory token, and retries the original request seamlessly.
