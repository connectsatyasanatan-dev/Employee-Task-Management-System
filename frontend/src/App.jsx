import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import "./App.css";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EmployeesPage = lazy(() => import("./pages/EmployeesPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const RouteLoader = () => (
  <div className="loading-screen" role="status" aria-label="Loading page content">
    <div className="spinner"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />

                {/* Admin Only Route */}
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route path="/employees" element={<EmployeesPage />} />
                </Route>
              </Route>
            </Route>

            {/* 404 Fallback Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;