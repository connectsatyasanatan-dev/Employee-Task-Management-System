import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  CheckSquare,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeft,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const AppLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sidebar_collapsed", String(isCollapsed));
    } catch {
      // Ignore localStorage errors
    }
  }, [isCollapsed]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Generate 2-letter initials for user avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`app-container ${isCollapsed ? "sidebar-is-collapsed" : ""}`}>
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`sidebar ${mobileMenuOpen ? "open" : ""} ${
          isCollapsed ? "collapsed" : ""
        }`}
        aria-label="Sidebar Navigation"
      >
        <div className="sidebar-header">
          {isCollapsed ? (
            <button
              type="button"
              className="sidebar-collapse-toggle-collapsed"
              onClick={toggleSidebarCollapse}
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <div className="sidebar-brand-icon">
                <Layers size={20} />
              </div>
            </button>
          ) : (
            <>
              <div className="sidebar-brand-wrapper">
                <div className="sidebar-brand-icon">
                  <Layers size={20} />
                </div>
                <div className="sidebar-brand-text">
                  <span className="brand-name">TaskFlow</span>
                </div>
              </div>
              <button
                type="button"
                className="sidebar-collapse-toggle desktop-only"
                onClick={toggleSidebarCollapse}
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
            </>
          )}
        </div>

        {!isCollapsed && <div className="sidebar-section-label">MAIN NAVIGATION</div>}

        <nav className="sidebar-nav" aria-label="Main Menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMobileMenu}
            title={isCollapsed ? "Dashboard" : undefined}
          >
            <LayoutDashboard size={19} className="nav-icon" />
            {!isCollapsed && <span className="nav-label">Dashboard</span>}
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={closeMobileMenu}
              title={isCollapsed ? "Employee Directory" : undefined}
            >
              <Users size={19} className="nav-icon" />
              {!isCollapsed && <span className="nav-label">Employee Directory</span>}
            </NavLink>
          )}

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeMobileMenu}
            title={isCollapsed ? "Task Management" : undefined}
          >
            <CheckSquare size={19} className="nav-icon" />
            {!isCollapsed && <span className="nav-label">Task Management</span>}
          </NavLink>
        </nav>

        {/* Sidebar Footer Info */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card" title={`${user?.name || "User"} (${user?.role || "employee"})`}>
            <div className="user-avatar-circle">
              {getInitials(user?.name)}
            </div>
            {!isCollapsed && (
              <div className="user-info-text">
                <span className="user-display-name">{user?.name || "User"}</span>
                <span className="user-role-label">
                  {isAdmin ? "Administrator" : "Staff Member"}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="header-greeting">
              <span className="greeting-text">
                Welcome back, <strong className="greeting-name">{user?.name || "User"}</strong>
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
              type="button"
              className="logout-btn"
              onClick={logout}
              aria-label="Sign out of application"
              title="Sign Out"
            >
              <LogOut size={15} />
              <span className="logout-text">Logout</span>
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
