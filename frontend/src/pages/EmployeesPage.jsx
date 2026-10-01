export const EmployeesPage = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Employee Directory</h1>
        <p className="page-subtitle">
          Manage workforce profiles, department assignments, and access statuses.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: "1.25rem", margin: "0 0 12px 0" }}>
          Employee Management Foundation
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          Admin employee listing, search, pagination, and modals will be connected here in Phase 3.
        </p>
      </div>
    </div>
  );
};

export default EmployeesPage;
