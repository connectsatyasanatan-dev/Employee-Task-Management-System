import { useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  FileText,
  Flag,
  Loader,
  Type,
  User,
} from "lucide-react";
import Modal from "../common/Modal";

const ALLOWED_PRIORITIES = [
  { value: "Low", label: "Low Priority", color: "#64748b" },
  { value: "Medium", label: "Medium Priority", color: "#d97706" },
  { value: "High", label: "High Priority", color: "#dc2626" },
];

const ALLOWED_STATUSES = [
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

export const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task = null,
  employees = [],
  loading = false,
  error = "",
}) => {
  const isEdit = Boolean(task);

  const [formData, setFormData] = useState(() => ({
    title: task?.title || "",
    description: task?.description || "",
    assigned_to_user_id: task?.assigned_to_user_id
      ? String(task.assigned_to_user_id)
      : employees.length > 0
      ? String(employees[0].id)
      : "",
    priority: task?.priority || "Medium",
    status: task?.status || "Pending",
    start_date: task?.start_date || new Date().toISOString().split("T")[0],
    due_date: task?.due_date || new Date().toISOString().split("T")[0],
  }));

  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.title.trim() || formData.title.trim().length < 2) {
      errors.title = "Task title must be at least 2 characters.";
    }
    if (!formData.assigned_to_user_id) {
      errors.assigned_to_user_id = "Please select an assigned employee.";
    }
    if (!formData.start_date) {
      errors.start_date = "Start date is required.";
    }
    if (!formData.due_date) {
      errors.due_date = "Due date is required.";
    }
    if (formData.start_date && formData.due_date && formData.due_date < formData.start_date) {
      errors.due_date = "Due date cannot be earlier than start date.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      assigned_to_user_id: Number(formData.assigned_to_user_id),
      priority: formData.priority,
      status: formData.status,
      start_date: formData.start_date,
      due_date: formData.due_date,
    };

    onSubmit(payload);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Task: ${task?.title}` : "Create New Task"}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="alert-danger" style={{ marginBottom: 20 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-grid">
          {/* Title Field */}
          <div className="form-group full-width">
            <label htmlFor="task-title" className="form-label">
              <Type size={14} className="form-label-icon" />
              <span>Task Title</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`form-input ${fieldErrors.title ? "input-error" : ""}`}
              placeholder="e.g. Implement User Authentication"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.title && <span className="field-error-text">{fieldErrors.title}</span>}
          </div>

          {/* Description Field */}
          <div className="form-group full-width">
            <label htmlFor="task-desc" className="form-label">
              <FileText size={14} className="form-label-icon" />
              <span>Description (Optional)</span>
            </label>
            <textarea
              id="task-desc"
              className="form-textarea"
              rows={3}
              placeholder="Provide detailed instructions, requirements, or context..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Assignee Selector */}
          <div className="form-group">
            <label htmlFor="task-assignee" className="form-label">
              <User size={14} className="form-label-icon" />
              <span>Assignee</span>
              <span className="required-star">*</span>
            </label>
            <select
              id="task-assignee"
              className={`form-select ${fieldErrors.assigned_to_user_id ? "input-error" : ""}`}
              value={formData.assigned_to_user_id}
              onChange={(e) => handleChange("assigned_to_user_id", e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select Employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department || emp.email})
                </option>
              ))}
            </select>
            {fieldErrors.assigned_to_user_id && (
              <span className="field-error-text">{fieldErrors.assigned_to_user_id}</span>
            )}
          </div>

          {/* Priority Field */}
          <div className="form-group">
            <label htmlFor="task-priority" className="form-label">
              <Flag size={14} className="form-label-icon" />
              <span>Priority</span>
              <span className="required-star">*</span>
            </label>
            <select
              id="task-priority"
              className="form-select"
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              disabled={loading}
            >
              {ALLOWED_PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="task-start" className="form-label">
              <Calendar size={14} className="form-label-icon" />
              <span>Start Date</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="task-start"
              type="date"
              className={`form-input ${fieldErrors.start_date ? "input-error" : ""}`}
              value={formData.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.start_date && (
              <span className="field-error-text">{fieldErrors.start_date}</span>
            )}
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label htmlFor="task-due" className="form-label">
              <Calendar size={14} className="form-label-icon" />
              <span>Due Date</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="task-due"
              type="date"
              className={`form-input ${fieldErrors.due_date ? "input-error" : ""}`}
              value={formData.due_date}
              onChange={(e) => handleChange("due_date", e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.due_date && (
              <span className="field-error-text">{fieldErrors.due_date}</span>
            )}
          </div>

          {/* Status Field */}
          <div className="form-group full-width">
            <label htmlFor="task-status" className="form-label">
              <CheckCircle2 size={14} className="form-label-icon" />
              <span>Workflow Status</span>
              <span className="required-star">*</span>
            </label>
            <select
              id="task-status"
              className="form-select"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              disabled={loading}
            >
              {ALLOWED_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader size={16} className="spin" />
                <span>Saving...</span>
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Task"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;

