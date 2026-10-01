export const TasksPage = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Task Management</h1>
        <p className="page-subtitle">
          View assigned tasks, update work statuses, and track project deadlines.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: "1.25rem", margin: "0 0 12px 0" }}>
          Task Board Foundation
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          Task filtering, status toggle, and creation modals will be connected here in Phase 4.
        </p>
      </div>
    </div>
  );
};

export default TasksPage;
