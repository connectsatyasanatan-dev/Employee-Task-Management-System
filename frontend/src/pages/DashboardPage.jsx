import { useAuth } from "../hooks/useAuth";

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name || "User"}!</h1>
        <p className="page-subtitle">
          Here is an overview of your organization workload and tasks.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: "1.25rem", margin: "0 0 12px 0" }}>
          Dashboard Foundation Ready
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          The frontend foundation layout, routing, and authentication system are fully active. Detailed metric cards and charts will be rendered here in Phase 2.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
