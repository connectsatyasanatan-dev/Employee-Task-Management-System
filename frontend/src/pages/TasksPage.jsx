import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Plus, RefreshCw, CheckCircle2, Filter } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import taskApi from "../api/taskApi";
import employeeApi from "../api/employeeApi";
import TaskTable from "../components/tasks/TaskTable";
import TaskModal from "../components/tasks/TaskModal";
import TaskDetailModal from "../components/tasks/TaskDetailModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

const PRIORITY_OPTIONS = [
  { label: "All Priorities", value: "" },
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const TasksPage = () => {
  const { isAdmin } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormLoading, setTaskFormLoading] = useState(false);
  const [taskFormError, setTaskFormError] = useState("");

  // Detail Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Delete Confirm Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetTask, setDeleteTargetTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load employees list for Admin filter and form assignees
  useEffect(() => {
    if (isAdmin) {
      employeeApi
        .getEmployees({ page_size: 100 })
        .then((data) => setEmployees(data.items || []))
        .catch(() => setEmployees([]));
    }
  }, [isAdmin]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        page_size: 10,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        assigned_to_user_id: assigneeFilter ? Number(assigneeFilter) : undefined,
      };
      const data = await taskApi.getTasks(params);
      setTasks(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load tasks list. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, priorityFilter, assigneeFilter]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchInitial = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          page_size: 10,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          assigned_to_user_id: assigneeFilter ? Number(assigneeFilter) : undefined,
        };
        const data = await taskApi.getTasks(params);
        if (isSubscribed) {
          setTasks(data.items || []);
          setTotal(data.total || 0);
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(
            err.response?.data?.detail || "Failed to load tasks list. Please try again."
          );
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchInitial();

    return () => {
      isSubscribed = false;
    };
  }, [page, statusFilter, priorityFilter, assigneeFilter]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  // Open Create Task Modal
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setTaskFormError("");
    setIsTaskModalOpen(true);
  };

  // Open Edit Task Modal
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setTaskFormError("");
    setIsTaskModalOpen(true);
  };

  // Open Task Details Modal
  const handleOpenDetailModal = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  // Open Delete Confirmation Dialog
  const handleOpenDeleteDialog = (task) => {
    setDeleteTargetTask(task);
    setIsDeleteDialogOpen(true);
  };

  // Submit Task Form (Create or Edit)
  const handleTaskFormSubmit = async (formData) => {
    setTaskFormLoading(true);
    setTaskFormError("");
    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, formData);
        showToast(`Task "${formData.title}" updated successfully.`);
      } else {
        await taskApi.createTask(formData);
        showToast(`Task "${formData.title}" created successfully.`);
      }
      setIsTaskModalOpen(false);
      loadTasks();
    } catch (err) {
      setTaskFormError(
        err.response?.data?.detail || "Failed to save task. Please verify inputs."
      );
    } finally {
      setTaskFormLoading(false);
    }
  };

  // Handle Quick Status Change (Row dropdown or Detail modal)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await taskApi.updateTaskStatus(taskId, newStatus);
      showToast(`Task status updated to "${newStatus}".`);

      // Update in-memory state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: updated.status } : t))
      );
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask((prev) => ({ ...prev, status: updated.status }));
      }
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Failed to update task status."
      );
    }
  };

  // Confirm Task Deletion
  const handleConfirmDelete = async () => {
    if (!deleteTargetTask) return;
    setDeleteLoading(true);
    try {
      await taskApi.deleteTask(deleteTargetTask.id);
      showToast(`Task "${deleteTargetTask.title}" deleted successfully.`);
      setIsDeleteDialogOpen(false);
      setDeleteTargetTask(null);
      loadTasks();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Failed to delete task."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="tasks-container">
      {/* Header */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="page-title">
            {isAdmin ? "Task Management Board" : "My Assigned Tasks"}
          </h1>
          <p className="page-subtitle">
            {isAdmin
              ? "Oversee organization task assignments, priorities, and workflow completion status."
              : "Track your assigned workload, review deadlines, and update progress status."}
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={loadTasks}
            disabled={loading}
            aria-label="Refresh tasks list"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              className="btn-primary"
              onClick={handleOpenCreateModal}
            >
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="alert-success" role="status" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Error Alert Box */}
      {error && (
        <div className="alert-danger" role="alert" style={{ marginBottom: 20 }}>
          <AlertCircle size={18} />
          <div style={{ flex: 1 }}>
            <strong>Error: </strong>
            <span>{error}</span>
          </div>
          <button type="button" className="btn-retry" onClick={loadTasks}>
            Retry
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="toolbar-card card" style={{ marginBottom: 20 }}>
        <div className="filter-group-row">
          <div className="filter-item">
            <Filter size={16} className="text-muted" />
            <select
              className="form-select filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter tasks by status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <select
              className="form-select filter-select"
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter tasks by priority"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <div className="filter-item">
              <select
                className="form-select filter-select"
                value={assigneeFilter}
                onChange={(e) => {
                  setAssigneeFilter(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter tasks by assignee"
              >
                <option value="">All Assignees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(statusFilter || priorityFilter || assigneeFilter) && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => {
                setStatusFilter("");
                setPriorityFilter("");
                setAssigneeFilter("");
                setPage(1);
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="toolbar-summary">
          {loading ? (
            <span className="text-muted">Loading count...</span>
          ) : (
            <span className="summary-badge">
              <strong>{total}</strong> {total === 1 ? "Task" : "Tasks"} Found
            </span>
          )}
        </div>
      </div>

      {/* Task List / Table */}
      <TaskTable
        tasks={tasks}
        loading={loading}
        isAdmin={isAdmin}
        onView={handleOpenDetailModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
        onStatusChange={handleStatusChange}
      />

      {/* Pagination Controls */}
      {!loading && total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={10}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* Create / Edit Modal */}
      <TaskModal
        key={editingTask ? editingTask.id : "new-task"}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskFormSubmit}
        task={editingTask}
        employees={employees}
        loading={taskFormLoading}
        error={taskFormError}
      />

      {/* Task Details View Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        onUpdateStatus={handleStatusChange}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete Task: ${deleteTargetTask?.title}`}
        message={`Are you sure you want to delete "${deleteTargetTask?.title}"? This action is permanent and cannot be undone.`}
        confirmText="Delete Task"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default TasksPage;
