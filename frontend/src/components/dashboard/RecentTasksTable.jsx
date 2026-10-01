import { useEffect, useState, useCallback } from "react";
import { AlertCircle, Calendar, CheckSquare, RefreshCw, User as UserIcon } from "lucide-react";
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

export const RecentTasksTable = ({ isAdmin }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecentTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskApi.getTasks({ page: 1, page_size: 5 });
      setTasks(data.items || []);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Could not load recent tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const loadTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await taskApi.getTasks({ page: 1, page_size: 5 });
        if (isSubscribed) {
          setTasks(data.items || []);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(
            err.response?.data?.detail || "Could not load recent tasks. Please try again."
          );
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="card tasks-card">
      <div className="card-header">
        <h2 className="card-title">
          {isAdmin ? "Recent Tasks Across Organization" : "My Recent Tasks"}
        </h2>
        <button
          className="btn-icon"
          onClick={fetchRecentTasks}
          disabled={loading}
          aria-label="Refresh recent tasks"
          title="Refresh recent tasks"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="table-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-cell skeleton-text" style={{ width: "40%" }} />
              <div className="skeleton-cell skeleton-text" style={{ width: "20%" }} />
              <div className="skeleton-cell skeleton-text" style={{ width: "20%" }} />
              <div className="skeleton-cell skeleton-text" style={{ width: "15%" }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="alert-danger" style={{ margin: 16 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button className="btn-retry" onClick={fetchRecentTasks}>
            Retry
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="chart-empty-state">
          <div className="empty-icon-wrapper">
            <CheckSquare size={32} />
          </div>
          <p className="empty-title">No Recent Tasks Found</p>
          <p className="empty-subtitle">
            {isAdmin
              ? "No tasks have been created in the system yet."
              : "You currently have no tasks assigned to you."}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table" aria-label="Recent tasks table">
            <thead>
              <tr>
                <th scope="col">Task Title</th>
                {isAdmin && <th scope="col">Assignee</th>}
                <th scope="col">Priority</th>
                <th scope="col">Status</th>
                <th scope="col">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <span className="task-title-text">{task.title}</span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="user-cell">
                        <UserIcon size={14} className="cell-icon" />
                        <span>{task.assignee_name || `User #${task.assigned_to_user_id}`}</span>
                      </div>
                    </td>
                  )}
                  <td>
                    <span className={`badge ${PRIORITY_CLASSES[task.priority] || "badge-secondary"}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CLASSES[task.status] || "badge-secondary"}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} className="cell-icon" />
                      <span>{task.due_date}</span>
                    </div>
                  </td>
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
