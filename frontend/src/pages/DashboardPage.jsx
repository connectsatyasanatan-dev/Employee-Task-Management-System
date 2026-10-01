import { useEffect, useState, useCallback } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  CheckSquare,
  Clock,
  Loader,
  RefreshCw,
  Users,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import dashboardApi from "../api/dashboardApi";
import StatCard from "../components/dashboard/StatCard";
import TaskDistributionChart from "../components/dashboard/TaskDistributionChart";
import RecentTasksTable from "../components/dashboard/RecentTasksTable";

export const DashboardPage = () => {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await dashboardApi.getDashboardStats();
      setStats(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(
        err.response?.data?.detail || "Could not load dashboard statistics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const loadStats = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await dashboardApi.getDashboardStats();
        if (isSubscribed) {
          setStats(data);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch (err) {
        if (isSubscribed) {
          setError(
            err.response?.data?.detail || "Could not load dashboard statistics. Please try again."
          );
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="page-title">
            {isAdmin ? "Administrator Dashboard" : "My Task Dashboard"}
          </h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.name || "User"}</strong>! Here is your real-time workload summary.
          </p>
        </div>

        <div className="dashboard-header-actions">
          {lastUpdated && (
            <span className="last-updated-text">Updated {lastUpdated}</span>
          )}
          <button
            className="btn-secondary"
            onClick={fetchDashboardStats}
            disabled={loading}
            aria-label="Refresh dashboard metrics"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Global Error State */}
      {error && (
        <div className="alert-danger" role="alert" style={{ marginBottom: 24 }}>
          <AlertCircle size={20} />
          <div style={{ flex: 1 }}>
            <strong>Dashboard Error: </strong>
            <span>{error}</span>
          </div>
          <button className="btn-retry" onClick={fetchDashboardStats}>
            Retry Data
          </button>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        {loading ? (
          Array.from({ length: isAdmin ? 6 : 5 }).map((_, i) => (
            <div key={i} className="stat-card skeleton-card">
              <div className="skeleton-text" style={{ width: "50%", height: 16 }} />
              <div className="skeleton-text" style={{ width: "30%", height: 32, marginTop: 8 }} />
            </div>
          ))
        ) : (
          <>
            {isAdmin && (
              <StatCard
                title="Total Employees"
                value={stats?.total_employees}
                icon={Users}
                variant="primary"
                subtitle="Active organization staff"
              />
            )}
            <StatCard
              title={isAdmin ? "Total Tasks" : "My Assigned Tasks"}
              value={stats?.total_tasks}
              icon={CheckSquare}
              variant="primary"
              subtitle={isAdmin ? "Total system tasks" : "Assigned to your account"}
            />
            <StatCard
              title="Pending Tasks"
              value={stats?.pending_tasks}
              icon={Clock}
              variant="warning"
              subtitle="Awaiting action"
            />
            <StatCard
              title="In Progress"
              value={stats?.in_progress_tasks}
              icon={Loader}
              variant="info"
              subtitle="Currently being executed"
            />
            <StatCard
              title="Completed Tasks"
              value={stats?.completed_tasks}
              icon={CheckCircle2}
              variant="success"
              subtitle="Finished tasks"
            />
            <StatCard
              title="Overdue Tasks"
              value={stats?.overdue_tasks}
              icon={AlertTriangle}
              variant="danger"
              subtitle="Past due date"
            />
          </>
        )}
      </div>

      {/* Main Content Grid: Chart + Recent Tasks */}
      <div className="dashboard-grid">
        <TaskDistributionChart stats={stats} />
        <RecentTasksTable isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default DashboardPage;
