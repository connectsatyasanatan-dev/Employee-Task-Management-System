import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  CheckSquare,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  Users,
  X,
  Sparkles,
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

  // Generate 2-letter initials for user avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
          <div className="sidebar-brand-icon">
            <Layers size={20} />
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-name">TaskFlow</span>
          </div>
        </div>

        <div className="sidebar-section-label">MENU</div>

        <nav className="sidebar-nav" aria-label="Main Navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            <LayoutDashboard size={18} className="nav-icon" />
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
              <Users size={18} className="nav-icon" />
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
            <CheckSquare size={18} className="nav-icon" />
            <span>Task Management</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer Info */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar-circle">
              {getInitials(user?.name)}
            </div>
            <div className="user-info-text">
              <span className="user-display-name">{user?.name || "User"}</span>
              <span className="user-role-label">
                {isAdmin ? "Admin Access" : "Staff Member"}
              </span>
            </div>
          </div>
        </div>
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
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="header-greeting">
              <span className="greeting-text">
                Welcome, <strong className="greeting-name">{user?.name || "User"}</strong>
              </span>
            </div>
          </div>

          <div className="header-right">
            <div className="user-profile-badge">
              <div className="user-avatar-small">
                {getInitials(user?.name)}
              </div>
              <span className="user-header-name">
                {user?.name || "User"}
              </span>
              <span className={`role-tag ${user?.role || "employee"}`}>
                {isAdmin ? (
                  <>
                    <ShieldCheck size={12} />
                    <span>ADMIN</span>
                  </>
                ) : (
                  <>
                    <User size={12} />
                    <span>STAFF</span>
                  </>
                )}
              </span>
            </div>

            <button
              className="logout-btn"
              onClick={logout}
              aria-label="Sign out of application"
              title="Sign Out"
            >
              <LogOut size={15} />
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
