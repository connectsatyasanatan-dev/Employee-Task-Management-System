import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Briefcase,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const AppLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Briefcase size={24} color="var(--primary)" />
          <span>Task Manager</span>
        </div>

        <nav className="sidebar-nav" aria-label="Main Navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={closeMobileMenu}
            >
              <Users size={20} />
              <span>Employee Directory</span>
            </NavLink>
          )}

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            <CheckSquare size={20} />
            <span>Task Management</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="header-right">
            <div className="user-profile-badge">
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {user?.name || "User"}
              </span>
              <span className={`role-tag ${user?.role || "employee"}`}>
                {user?.role || "employee"}
              </span>
            </div>

            <button
              className="logout-btn"
              onClick={logout}
              aria-label="Sign out of application"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
