import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckSquare,
  Clock,
  ExternalLink,
  ListTodo,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
} from "lucide-react";
import taskApi from "../../api/taskApi";

const PRIORITY_CLASSES = {
  High: "badge-danger",
  Medium: "badge-warning",
  Low: "badge-secondary",
};

const STATUS_CLASSES = {
  Pending: "badge-warning",
  "In Progress": "badge-info",
  Completed: "badge-success",
};

export const RecentTasksTable = ({
  isAdmin,
  isExpanded = false,
  onToggleExpand,
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const fetchRecentTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskApi.getTasks({
        page: 1,
        page_size: isExpanded ? 15 : 6,
      });
      setTasks(data.items || []);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Could not load recent tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [isExpanded]);

  useEffect(() => {
    fetchRecentTasks();
  }, [fetchRecentTasks]);

  // Filter tasks in expanded mode
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchFilter === "" ||
      task.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      task.assignee_name?.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`card tasks-card ${isExpanded ? "expanded-card" : ""}`}>
      {/* Card Header */}
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-title-with-icon">
            <ListTodo size={18} className="title-icon primary-text" />
            <h2 className="card-title">
              {isAdmin ? "Recent Organization Tasks" : "My Recent Tasks"}
            </h2>
          </div>
          <span className="card-badge">{tasks.length} tasks</span>
        </div>

        <div className="card-header-actions">
          <Link to="/tasks" className="view-all-link" title="Navigate to full task management">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>

          <button
            type="button"
            className="btn-icon"
            onClick={fetchRecentTasks}
            disabled={loading}
            aria-label="Refresh recent tasks"
            title="Refresh recent tasks"
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} />
          </button>

          {onToggleExpand && (
            <button
              type="button"
              className="btn-icon expand-toggle-btn"
              onClick={onToggleExpand}
              title={isExpanded ? "Collapse to split view" : "Expand table view"}
              aria-label={isExpanded ? "Collapse to split view" : "Expand table view"}
            >
              {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span className="expand-btn-text">
                {isExpanded ? "Collapse" : "Expand"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Mode Quick Search & Status Filter Bar */}
      {isExpanded && (
        <div className="table-filter-bar">
          <div className="search-input-wrapper flex-1">
            <Search size={16} className="search-input-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Filter by title, description or assignee..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              aria-label="Filter tasks in expanded table"
            />
          </div>

          <div className="filter-pill-group">
            {["all", "Pending", "In Progress", "Completed"].map((status) => (
              <button
                key={status}
                type="button"
                className={`filter-pill-btn ${
                  statusFilter === status ? "active" : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "All Status" : status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="table-skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-cell skeleton-text skeleton-w-40" />
              <div className="skeleton-cell skeleton-text skeleton-w-20" />
              <div className="skeleton-cell skeleton-text skeleton-w-20" />
              <div className="skeleton-cell skeleton-text skeleton-w-15" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="alert-danger mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button className="btn-retry" onClick={fetchRecentTasks}>
            Retry
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="chart-empty-state">
          <div className="empty-icon-wrapper">
            <CheckSquare size={32} />
          </div>
          <p className="empty-title">
            {tasks.length === 0
              ? "No Recent Tasks Found"
              : "No Tasks Match Your Filter"}
          </p>
          <p className="empty-subtitle">
            {tasks.length === 0
              ? isAdmin
                ? "No tasks have been created in the system yet."
                : "You currently have no tasks assigned to you."
              : "Try adjusting your search keywords or status filter."}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table" aria-label="Recent tasks table">
            <thead>
              <tr>
                <th scope="col">Task Details</th>
                {isAdmin && <th scope="col">Assignee</th>}
                <th scope="col">Priority</th>
                <th scope="col">Status</th>
                <th scope="col">Due Date</th>
                {isExpanded && <th scope="col" className="text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="interactive-table-row">
                  <td>
                    <div className="task-info-stack">
                      <span className="task-title-text" title={task.title}>
                        {task.title}
                      </span>
                      {isExpanded && task.description && (
                        <span className="task-desc-sub text-truncate">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {isAdmin && (
                    <td>
                      <div className="user-profile-cell">
                        <div className="table-avatar-circle small">
                          {getInitials(task.assignee_name)}
                        </div>
                        <span className="user-name-text">
                          {task.assignee_name || `User #${task.assigned_to_user_id}`}
                        </span>
                      </div>
                    </td>
                  )}

                  <td>
                    <span
                      className={`badge ${
                        PRIORITY_CLASSES[task.priority] || "badge-secondary"
                      }`}
                    >
                      <span className="badge-dot" />
                      {task.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        STATUS_CLASSES[task.status] || "badge-secondary"
                      }`}
                    >
                      <span className="badge-dot" />
                      {task.status}
                    </span>
                  </td>

                  <td>
                    <div className="date-cell">
                      <Calendar size={13} className="cell-icon" />
                      <span>{task.due_date}</span>
                    </div>
                  </td>

                  {isExpanded && (
                    <td className="text-right">
                      <Link
                        to="/tasks"
                        className="btn-table-action"
                        title="Open task in Tasks management"
                      >
                        <span>Manage</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentTasksTable;
