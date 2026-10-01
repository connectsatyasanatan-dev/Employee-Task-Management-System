import { useState } from "react";
import { AlertCircle, Calendar, Clock, UserCheck, Loader } from "lucide-react";
import Modal from "../common/Modal";

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

export const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  onUpdateStatus,
  loading = false,
  error = "",
}) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  if (!task) return null;

  const currentStatus = selectedStatus || task.status;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    if (newStatus !== task.status) {
      setUpdating(true);
      try {
        await onUpdateStatus(task.id, newStatus);
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      maxWidth="580px"
    >
      <div className="task-detail-container">
        {error && (
          <div className="alert-danger" style={{ marginBottom: 16 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="task-detail-header">
          <h2 className="task-detail-title">{task.title}</h2>
          <div className="task-detail-badges">
            <span className={`badge ${PRIORITY_CLASSES[task.priority] || "badge-secondary"}`}>
              {task.priority} Priority
            </span>
            <span className={`badge ${STATUS_CLASSES[task.status] || "badge-secondary"}`}>
              {task.status}
            </span>
          </div>
        </div>

        {task.description ? (
          <div className="task-detail-description">
            <h4 className="detail-section-title">Description</h4>
            <p className="description-text">{task.description}</p>
          </div>
        ) : (
          <p className="text-muted" style={{ fontStyle: "italic", marginBottom: 16 }}>
            No description provided for this task.
          </p>
        )}

        <div className="task-detail-grid">
          <div className="detail-item">
            <div className="detail-label">
              <UserCheck size={15} />
              <span>Assigned To</span>
            </div>
            <div className="detail-value">
              {task.assignee_name || `User #${task.assigned_to_user_id}`}
              {task.assignee_email && (
                <span className="detail-subvalue"> ({task.assignee_email})</span>
              )}
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Calendar size={15} />
              <span>Start Date</span>
            </div>
            <div className="detail-value">{task.start_date}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Clock size={15} />
              <span>Due Date</span>
            </div>
            <div className="detail-value">{task.due_date}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Clock size={15} />
              <span>Created On</span>
            </div>
            <div className="detail-value">
              {new Date(task.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Quick Status Update Selector */}
        <div className="status-update-box">
          <label htmlFor="modal-status-select" className="form-label">
            Update Task Status
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              id="modal-status-select"
              className="form-select"
              value={currentStatus}
              onChange={handleStatusChange}
              disabled={loading || updating}
            >
              {ALLOWED_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {updating && <Loader size={18} className="spin text-primary" />}
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
