# Frontend Architecture — React & Vite

## 🛠️ Stack & Current Implementation Status

* **Build Tool**: Vite 6.2+
* **UI Framework**: React 19.0+
* **HTTP Client**: Axios 1.7+
* **Styling**: Vanilla CSS (`App.css`, `index.css`)

---

## 🔌 API Client Configuration

The frontend API client is initialized in [`frontend/src/api/client.js`](file:///d:/Task-Management/frontend/src/api/client.js):

```javascript
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
```

---

## 🔍 Current UI State & Planned Roadmap

* **Current Implementation**: [`App.jsx`](file:///d:/Task-Management/frontend/src/App.jsx) currently displays a minimal placeholder component that performs a single `GET /health` API connection test.
* **Planned Frontend Work**:
  1. Add `react-router-dom` for client-side page routing.
  2. Implement `AuthContext` to manage JWT access tokens and authenticated user state.
  3. Configure Axios request interceptor to attach `Authorization: Bearer <token>` and response interceptor to auto-call `/api/auth/refresh` on HTTP 401.
  4. Build Login view, Admin Dashboard, Employee Management UI, and Task Management Board.
