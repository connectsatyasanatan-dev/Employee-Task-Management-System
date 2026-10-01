import { Edit2, UserCheck, UserX, Mail, Phone, Briefcase, Building } from "lucide-react";

export const EmployeeTable = ({
  employees = [],
  loading = false,
  onEdit,
  onToggleStatus,
}) => {
  const getInitials = (name) => {
    if (!name) return "E";
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
              <div className="skeleton-cell skeleton-text skeleton-w-25" />
              <div className="skeleton-cell skeleton-text skeleton-w-25" />
              <div className="skeleton-cell skeleton-text skeleton-w-15" />
              <div className="skeleton-cell skeleton-text skeleton-w-15" />
              <div className="skeleton-cell skeleton-text skeleton-w-10" />
              <div className="skeleton-cell skeleton-text skeleton-w-10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="card empty-state-card">
        <div className="empty-icon-wrapper">
          <UserX size={32} />
        </div>
        <h3 className="empty-title">No Employees Found</h3>
        <p className="empty-subtitle">
          No employee records match your search criteria. Try adjusting your query or add a new employee.
        </p>
      </div>
    );
  }

  return (
    <div className="card employee-list-card p-0">
      {/* Desktop & Tablet Table */}
      <div className="table-responsive desktop-only-table">
        <table className="data-table" aria-label="Employee directory table">
          <thead>
            <tr>
              <th scope="col">Employee Name</th>
              <th scope="col">Contact</th>
              <th scope="col">Department</th>
              <th scope="col">Designation</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="employee-profile-cell">
                    <div className="table-avatar-circle">
                      {getInitials(employee.name)}
                    </div>
                    <div className="employee-name-cell">
                      <span className="emp-name-text">{employee.name}</span>
                      <span className="emp-id-sub">EMP #{employee.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <div className="cell-sub-row">
                      <Mail size={13} className="cell-icon" />
                      <span>{employee.email}</span>
                    </div>
                    {employee.phone && (
                      <div className="cell-sub-row text-muted mt-1">
                        <Phone size={13} className="cell-icon" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-sub-row">
                    <Building size={14} className="cell-icon" />
                    <span>{employee.department || "—"}</span>
                  </div>
                </td>
                <td>
                  <div className="cell-sub-row">
                    <Briefcase size={14} className="cell-icon" />
                    <span>{employee.designation || "—"}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      employee.is_active ? "badge-success" : "badge-secondary"
                    }`}
                  >
                    <span className="badge-dot" />
                    {employee.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="actions-cell justify-end">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onEdit(employee)}
                      title="Edit employee details"
                      aria-label={`Edit ${employee.name}`}
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      type="button"
                      className={`btn-icon ${
                        employee.is_active ? "btn-icon-danger" : "btn-icon-success"
                      }`}
                      onClick={() => onToggleStatus(employee)}
                      title={employee.is_active ? "Deactivate account" : "Activate account"}
                      aria-label={`${
                        employee.is_active ? "Deactivate" : "Activate"
                      } ${employee.name}`}
                    >
                      {employee.is_active ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="mobile-cards-grid mobile-only-cards">
        {employees.map((employee) => (
          <div key={employee.id} className="mobile-employee-card">
            <div className="card-header-compact">
              <div className="employee-profile-cell">
                <div className="table-avatar-circle">
                  {getInitials(employee.name)}
                </div>
                <div>
                  <h3 className="emp-card-name">{employee.name}</h3>
                  <span className="emp-card-title">{employee.designation || "Employee"}</span>
                </div>
              </div>
              <span
                className={`badge ${
                  employee.is_active ? "badge-success" : "badge-secondary"
                }`}
              >
                <span className="badge-dot" />
                {employee.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="card-body-compact">
              <div className="card-info-row">
                <Mail size={14} className="cell-icon" />
                <span>{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="card-info-row">
                  <Phone size={14} className="cell-icon" />
                  <span>{employee.phone}</span>
                </div>
              )}
              <div className="card-info-row">
                <Building size={14} className="cell-icon" />
                <span>{employee.department || "—"}</span>
              </div>
            </div>

            <div className="card-footer-compact">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => onEdit(employee)}
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                className={`btn-sm ${
                  employee.is_active ? "btn-danger" : "btn-primary"
                }`}
                onClick={() => onToggleStatus(employee)}
              >
                {employee.is_active ? (
                  <>
                    <UserX size={14} />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <UserCheck size={14} />
                    <span>Activate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTable;
