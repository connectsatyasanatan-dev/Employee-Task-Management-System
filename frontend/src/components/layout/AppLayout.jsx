import { useState, useEffect, useRef } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import {
  Briefcase,
  CheckSquare,
  ChevronDown,
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Click outside listener for User Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userDropdownOpen]);

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
              className="sidebar-collapsed-brand-btn"
              onClick={toggleSidebarCollapse}
              title="Click to expand sidebar"
              aria-label="Expand Sidebar"
            >
              <div className="sidebar-brand-icon">
                <Layers size={20} className="brand-icon-default" />
                <PanelLeft size={19} className="brand-icon-hover" />
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

        <div className="sidebar-section-label">MAIN NAVIGATION</div>

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
            <span className="nav-label">Dashboard</span>
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
              <span className="nav-label">Employee Directory</span>
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
            <span className="nav-label">Task Management</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer Info */}
        <div className="sidebar-footer">
          <div
            className="sidebar-user-card"
            title={`${user?.name || "User"} (${user?.role || "employee"})`}
          >
            <div className="user-avatar-circle">
              {getInitials(user?.name)}
            </div>
            <div className="user-info-text">
              <span className="user-display-name">{user?.name || "User"}</span>
              <span className="user-role-label">
                {isAdmin ? "Administrator" : "Staff Member"}
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
            {/* Professional User Profile Dropdown */}
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`user-profile-dropdown-btn ${userDropdownOpen ? "active" : ""}`}
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                aria-label="User Account Menu"
              >
                <div className="user-avatar-small">
                  {getInitials(user?.name)}
                </div>
                <div className="user-profile-meta">
                  <span className="user-header-name">
                    {user?.name || "User"}
                  </span>
                  <span className={`role-tag-mini ${user?.role || "employee"}`}>
                    {isAdmin ? "ADMIN" : "STAFF"}
                  </span>
                </div>
                <ChevronDown
                  size={15}
                  className={`dropdown-chevron ${userDropdownOpen ? "rotate" : ""}`}
                />
              </button>

              {/* Dropdown Popup Menu */}
              {userDropdownOpen && (
                <div className="user-dropdown-menu" role="menu">
                  <div className="dropdown-user-header">
                    <div className="dropdown-avatar-large">
                      {getInitials(user?.name)}
                    </div>
                    <div className="dropdown-user-details">
                      <span className="dropdown-user-fullname">
                        {user?.name || "User"}
                      </span>
                      <span className="dropdown-user-email">
                        {user?.email || "user@taskflow.local"}
                      </span>
                      <span className={`role-tag ${user?.role || "employee"}`}>
                        {isAdmin ? (
                          <>
                            <ShieldCheck size={12} />
                            <span>Administrator</span>
                          </>
                        ) : (
                          <>
                            <User size={12} />
                            <span>Staff Member</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <div className="dropdown-links-list">
                    <Link
                      to="/dashboard"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                      role="menuitem"
                    >
                      <LayoutDashboard size={16} className="dropdown-item-icon" />
                      <span>Dashboard Overview</span>
                    </Link>

                    <Link
                      to="/tasks"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                      role="menuitem"
                    >
                      <CheckSquare size={16} className="dropdown-item-icon" />
                      <span>Task Management</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/employees"
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                        role="menuitem"
                      >
                        <Users size={16} className="dropdown-item-icon" />
                        <span>Employee Directory</span>
                      </Link>
                    )}
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-item logout-dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    role="menuitem"
                  >
                    <LogOut size={16} className="dropdown-item-icon" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
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
