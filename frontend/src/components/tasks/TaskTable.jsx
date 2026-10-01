import { Eye, Edit2, Trash2, Calendar, User, CheckSquare } from "lucide-react";

const ALLOWED_STATUSES = ["Pending", "In Progress", "Completed"];

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

export const TaskTable = ({
  tasks = [],
  loading = false,
  isAdmin = false,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <div className="card">
        <div className="table-skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-cell skeleton-text" style={{ width: "30%" }} />
              <div className="skeleton-cell skeleton-text" style={{ width: "20%" }} />
              <div className="skeleton-cell skeleton-text" style={{ width: "15%" }} />
              <div className="skeleton-cell skeleton-text" style={{ width: "15%" }} />
              <div className="skeleton-cell skeleton-text" style={{ width: "10%" }} />
              <div className="skeleton-cell skeleton-text" style={{ width: "10%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="card empty-state-card">
        <div className="empty-icon-wrapper">
          <CheckSquare size={32} />
        </div>
        <h3 className="empty-title">No Tasks Found</h3>
        <p className="empty-subtitle">
          {isAdmin
            ? "No tasks match your current filter settings. Create a new task to get started."
            : "You currently have no tasks assigned matching this criteria."}
        </p>
      </div>
    );
  }

  return (
    <div className="card task-list-card" style={{ padding: 0 }}>
      {/* Desktop Table */}
      <div className="table-responsive desktop-only-table">
        <table className="data-table" aria-label="Task management table">
          <thead>
            <tr>
              <th scope="col">Task Details</th>
              <th scope="col">Assignee</th>
              <th scope="col">Priority</th>
              <th scope="col">Status</th>
              <th scope="col">Due Date</th>
              <th scope="col" style={{ textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <div className="task-title-cell">
                    <span className="task-title-text clickable" onClick={() => onView(task)}>
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="task-desc-sub truncate-text">{task.description}</span>
                    )}
                  </div>
                </td>
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
                <td>
                  <span className={`badge ${PRIORITY_CLASSES[task.priority] || "badge-secondary"}`}>
                    <span className="badge-dot" />
                    {task.priority}
                  </span>
                </td>
                <td>
                  <select
                    className={`badge-select ${STATUS_CLASSES[task.status] || "badge-secondary"}`}
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                    aria-label={`Change status for ${task.title}`}
                  >
                    {ALLOWED_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={14} className="cell-icon" />
                    <span>{task.due_date}</span>
                  </div>
                </td>
                <td>
                  <div className="actions-cell" style={{ justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onView(task)}
                      title="View task details"
                      aria-label={`View ${task.title}`}
                    >
                      <Eye size={15} />
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => onEdit(task)}
                          title="Edit task details"
                          aria-label={`Edit ${task.title}`}
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => onDelete(task)}
                          title="Delete task"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="mobile-cards-grid mobile-only-cards">
        {tasks.map((task) => (
          <div key={task.id} className="mobile-task-card">
            <div className="card-header-compact">
              <div>
                <h3 className="task-card-title" onClick={() => onView(task)}>
                  {task.title}
                </h3>
                <span className="task-card-assignee">
                  Assigned: {task.assignee_name || `User #${task.assigned_to_user_id}`}
                </span>
              </div>
              <span className={`badge ${PRIORITY_CLASSES[task.priority] || "badge-secondary"}`}>
                <span className="badge-dot" />
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className="task-card-desc truncate-text">{task.description}</p>
            )}

            <div className="card-body-compact">
              <div className="card-info-row">
                <span className="text-muted">Status:</span>
                <select
                  className={`badge-select ${STATUS_CLASSES[task.status] || "badge-secondary"}`}
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                >
                  {ALLOWED_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card-info-row">
                <Calendar size={14} className="cell-icon" />
                <span>Due: {task.due_date}</span>
              </div>
            </div>

            <div className="card-footer-compact">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => onView(task)}
              >
                <Eye size={14} />
                <span>Details</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => onEdit(task)}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => onDelete(task)}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTable;
