import { useEffect, useState, useCallback } from "react";
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CheckSquare,
  Clock,
  Columns,
  ListTodo,
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
  const [viewMode, setViewMode] = useState("split"); // 'split' | 'chart' | 'table'

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

  const handleToggleChartExpand = () => {
    setViewMode((prev) => (prev === "chart" ? "split" : "chart"));
  };

  const handleToggleTableExpand = () => {
    setViewMode((prev) => (prev === "table" ? "split" : "table"));
  };

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-header-row">
        <div className="dashboard-header-info">
          <h1 className="page-title">
            {isAdmin ? "Administrator Dashboard" : "My Task Dashboard"}
          </h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.name || "User"}</strong>! Here is your real-time workload summary.
          </p>
        </div>

        <div className="dashboard-header-actions">
          {/* Segmented Layout View Switcher */}
          <div className="view-mode-segmented-control" role="group" aria-label="Dashboard layout view">
            <button
              type="button"
              className={`view-mode-pill ${viewMode === "split" ? "active" : ""}`}
              onClick={() => setViewMode("split")}
              title="Side-by-side Split View"
              aria-label="Side-by-side Split View"
            >
              <Columns size={14} />
              <span>Split View</span>
            </button>
            <button
              type="button"
              className={`view-mode-pill ${viewMode === "chart" ? "active" : ""}`}
              onClick={() => setViewMode("chart")}
              title="Expand Chart Analytics"
              aria-label="Expand Chart Analytics"
            >
              <BarChart3 size={14} />
              <span>Chart Analytics</span>
            </button>
            <button
              type="button"
              className={`view-mode-pill ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Expand Task Stream Table"
              aria-label="Expand Task Stream Table"
            >
              <ListTodo size={14} />
              <span>Task Stream</span>
            </button>
          </div>

          {lastUpdated && (
            <span className="last-updated-text">Updated {lastUpdated}</span>
          )}

          <button
            className="btn-secondary"
            onClick={fetchDashboardStats}
            disabled={loading}
            aria-label="Refresh dashboard metrics"
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Global Error State */}
      {error && (
        <div className="alert-danger mb-4" role="alert">
          <AlertCircle size={20} />
          <div className="flex-1">
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
              <div className="skeleton-text skeleton-w-50 skeleton-cell" />
              <div className="skeleton-text skeleton-w-30 skeleton-cell mt-2" />
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

      {/* Main Analytics Content Section */}
      <div className={`dashboard-grid view-${viewMode}`}>
        {(viewMode === "split" || viewMode === "chart") && (
          <TaskDistributionChart
            stats={stats}
            isExpanded={viewMode === "chart"}
            onToggleExpand={handleToggleChartExpand}
          />
        )}
        {(viewMode === "split" || viewMode === "table") && (
          <RecentTasksTable
            isAdmin={isAdmin}
            isExpanded={viewMode === "table"}
            onToggleExpand={handleToggleTableExpand}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
