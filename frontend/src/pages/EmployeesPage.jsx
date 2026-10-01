import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Search, UserPlus, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import employeeApi from "../api/employeeApi";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeModal from "../components/employees/EmployeeModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";

export const EmployeesPage = () => {
  const { isAdmin } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Status confirm dialog state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusTargetEmployee, setStatusTargetEmployee] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch employees list
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await employeeApi.getEmployees({
        page,
        page_size: 10,
        search: debouncedSearch.trim() || undefined,
      });
      setEmployees(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load employees list. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchInitial = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await employeeApi.getEmployees({
          page,
          page_size: 10,
          search: debouncedSearch.trim() || undefined,
        });
        if (isSubscribed) {
          setEmployees(data.items || []);
          setTotal(data.total || 0);
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(
            err.response?.data?.detail || "Failed to load employees list. Please try again."
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
  }, [page, debouncedSearch]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormError("");
    setIsModalOpen(true);
  };

  // Handle Form Submission (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setFormError("");
    try {
      if (editingEmployee) {
        await employeeApi.updateEmployee(editingEmployee.id, formData);
        showToast(`Employee "${formData.name}" updated successfully.`);
      } else {
        await employeeApi.createEmployee(formData);
        showToast(`Employee "${formData.name}" created successfully.`);
      }
      setIsModalOpen(false);
      loadEmployees();
    } catch (err) {
      setFormError(
        err.response?.data?.detail || "Failed to save employee. Please verify form details."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Open Status Confirmation Dialog
  const handleOpenStatusDialog = (emp) => {
    setStatusTargetEmployee(emp);
    setIsStatusDialogOpen(true);
  };

  // Confirm Status Toggle
  const handleConfirmStatusToggle = async () => {
    if (!statusTargetEmployee) return;
    setStatusLoading(true);
    try {
      const nextState = !statusTargetEmployee.is_active;
      await employeeApi.updateEmployeeStatus(statusTargetEmployee.id, nextState);
      showToast(
        `Employee "${statusTargetEmployee.name}" has been ${
          nextState ? "activated" : "deactivated"
        }.`
      );
      setIsStatusDialogOpen(false);
      setStatusTargetEmployee(null);
      loadEmployees();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Failed to update employee status."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="employees-container">
      {/* Page Header */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">
            Manage organization staff members, department roles, and active access privileges.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={loadEmployees}
            disabled={loading}
            aria-label="Refresh employees list"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              className="btn-primary"
              onClick={handleOpenAddModal}
            >
              <UserPlus size={16} />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Toast */}
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
          <button type="button" className="btn-retry" onClick={loadEmployees}>
            Retry
          </button>
        </div>
      )}

      {/* Toolbar: Search input & total count */}
      <div className="toolbar-card card" style={{ marginBottom: 20 }}>
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search employees by name or email"
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="toolbar-summary">
          {loading ? (
            <span className="text-muted">Loading employee count...</span>
          ) : (
            <span className="summary-badge">
              <strong>{total}</strong> {total === 1 ? "Employee" : "Employees"} Total
            </span>
          )}
        </div>
      </div>

      {/* Employee List / Table */}
      <EmployeeTable
        employees={employees}
        loading={loading}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleOpenStatusDialog}
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

      {/* Add / Edit Modal */}
      <EmployeeModal
        key={editingEmployee ? editingEmployee.id : "new-employee"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
        loading={formLoading}
        error={formError}
      />

      {/* Status Activation/Deactivation Confirm Dialog */}
      <ConfirmDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleConfirmStatusToggle}
        title={
          statusTargetEmployee?.is_active
            ? `Deactivate Employee: ${statusTargetEmployee?.name}`
            : `Activate Employee: ${statusTargetEmployee?.name}`
        }
        message={
          statusTargetEmployee?.is_active
            ? `Are you sure you want to deactivate ${statusTargetEmployee?.name}? Inactive employees cannot log into the system.`
            : `Are you sure you want to activate ${statusTargetEmployee?.name}? They will regain full login access to the system.`
        }
        confirmText={statusTargetEmployee?.is_active ? "Deactivate" : "Activate"}
        variant={statusTargetEmployee?.is_active ? "danger" : "primary"}
        loading={statusLoading}
      />
    </div>
  );
};

export default EmployeesPage;
