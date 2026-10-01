import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader,
  Maximize2,
  Minimize2,
  PieChart as ChartIcon,
  TrendingUp,
} from "lucide-react";

const STATUS_CONFIG = {
  Pending: {
    color: "#f59e0b",
    icon: Clock,
    bgClass: "var(--warning-light)",
    textClass: "var(--warning)",
    desc: "Awaiting start",
  },
  "In Progress": {
    color: "#3b82f6",
    icon: Loader,
    bgClass: "var(--info-light)",
    textClass: "var(--info)",
    desc: "Actively working",
  },
  Completed: {
    color: "#10b981",
    icon: CheckCircle2,
    bgClass: "var(--success-light)",
    textClass: "var(--success)",
    desc: "Successfully finished",
  },
  Overdue: {
    color: "#ef4444",
    icon: AlertTriangle,
    bgClass: "var(--danger-light)",
    textClass: "var(--danger)",
    desc: "Past deadline",
  },
};

export const TaskDistributionChart = ({
  stats,
  isExpanded = false,
  onToggleExpand,
}) => {
  const totalTasks = stats?.total_tasks || 0;
  const completedTasks = stats?.completed_tasks || 0;
  const pendingTasks = stats?.pending_tasks || 0;
  const inProgressTasks = stats?.in_progress_tasks || 0;
  const overdueTasks = stats?.overdue_tasks || 0;

  const data = [
    { name: "Pending", value: pendingTasks, color: STATUS_CONFIG.Pending.color },
    { name: "In Progress", value: inProgressTasks, color: STATUS_CONFIG["In Progress"].color },
    { name: "Completed", value: completedTasks, color: STATUS_CONFIG.Completed.color },
    { name: "Overdue", value: overdueTasks, color: STATUS_CONFIG.Overdue.color },
  ].filter((item) => item.value > 0);

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeTasks = pendingTasks + inProgressTasks;

  if (totalTasks === 0 || data.length === 0) {
    return (
      <div className={`card chart-card ${isExpanded ? "expanded-card" : ""}`}>
        <div className="card-header">
          <div className="card-title-group">
            <h2 className="card-title">Task Status Breakdown</h2>
            <span className="card-badge">0 Tasks</span>
          </div>
          {onToggleExpand && (
            <button
              type="button"
              className="btn-icon"
              onClick={onToggleExpand}
              title={isExpanded ? "Collapse view" : "Expand chart view"}
              aria-label={isExpanded ? "Collapse view" : "Expand chart view"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
        </div>
        <div className="chart-empty-state">
          <div className="empty-icon-wrapper">
            <ChartIcon size={32} />
          </div>
          <p className="empty-title">No Task Data Available</p>
          <p className="empty-subtitle">
            There are currently no tasks recorded to generate distribution metrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card chart-card ${isExpanded ? "expanded-card" : ""}`}>
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-title-with-icon">
            <ChartIcon size={18} className="title-icon primary-text" />
            <h2 className="card-title">Task Status Breakdown</h2>
          </div>
          <span className="card-badge">{totalTasks} Total Tasks</span>
        </div>

        <div className="card-header-actions">
          {onToggleExpand && (
            <button
              type="button"
              className="btn-icon expand-toggle-btn"
              onClick={onToggleExpand}
              title={isExpanded ? "Collapse to split view" : "Expand chart view"}
              aria-label={isExpanded ? "Collapse to split view" : "Expand chart view"}
            >
              {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span className="expand-btn-text">
                {isExpanded ? "Collapse" : "Expand"}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className={`chart-wrapper ${isExpanded ? "expanded-layout" : ""}`}>
        {/* Donut Chart Container */}
        <div className="chart-container-box">
          <div className="donut-chart-relative">
            <ResponsiveContainer width="100%" height={isExpanded ? 260 : 210}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={isExpanded ? 75 : 58}
                  outerRadius={isExpanded ? 105 : 82}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={750}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} tasks`, name]}
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    boxShadow: "var(--shadow-md)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total / Rate Overlay */}
            <div className="donut-center-metric">
              <span className="donut-center-value">{totalTasks}</span>
              <span className="donut-center-label">Total Tasks</span>
            </div>
          </div>
        </div>

        {/* Legend & Breakdown Analytics */}
        <div className={`chart-legend-grid ${isExpanded ? "expanded-grid" : ""}`}>
          {Object.entries(STATUS_CONFIG).map(([statusName, config]) => {
            const count =
              statusName === "Pending"
                ? pendingTasks
                : statusName === "In Progress"
                ? inProgressTasks
                : statusName === "Completed"
                ? completedTasks
                : overdueTasks;

            const percentage =
              totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
            const IconComponent = config.icon;

            return (
              <div key={statusName} className="legend-item-card">
                <div className="legend-item-header">
                  <div className="legend-label-group">
                    <span
                      className="legend-icon-badge"
                      style={{
                        backgroundColor: config.bgClass,
                        color: config.textClass,
                      }}
                    >
                      <IconComponent size={14} />
                    </span>
                    <div className="legend-label-col">
                      <span className="legend-label-title">{statusName}</span>
                      {isExpanded && (
                        <span className="legend-label-desc">{config.desc}</span>
                      )}
                    </div>
                  </div>
                  <div className="legend-value-pill">
                    <span className="legend-count-num">{count}</span>
                    <span className="legend-percentage-text">({percentage}%)</span>
                  </div>
                </div>

                {/* Progress Bar Indicator */}
                <div className="status-progress-track">
                  <div
                    className="status-progress-bar"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: config.color,
                    }}
                    aria-label={`${statusName} is ${percentage}% of total tasks`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded View Extra Analytics Row */}
        {isExpanded && (
          <div className="chart-expanded-insights">
            <div className="insight-metric-card">
              <div className="insight-icon-box success-bg">
                <TrendingUp size={20} className="success-text" />
              </div>
              <div className="insight-info">
                <span className="insight-label">Overall Completion Rate</span>
                <span className="insight-value">{completionRate}%</span>
                <span className="insight-sub">
                  {completedTasks} of {totalTasks} tasks completed
                </span>
              </div>
            </div>

            <div className="insight-metric-card">
              <div className="insight-icon-box warning-bg">
                <Clock size={20} className="warning-text" />
              </div>
              <div className="insight-info">
                <span className="insight-label">Active Workload</span>
                <span className="insight-value">{activeTasks}</span>
                <span className="insight-sub">
                  Tasks pending or currently in progress
                </span>
              </div>
            </div>

            <div className="insight-metric-card">
              <div
                className={`insight-icon-box ${
                  overdueTasks > 0 ? "danger-bg" : "neutral-bg"
                }`}
              >
                <AlertTriangle
                  size={20}
                  className={overdueTasks > 0 ? "danger-text" : "muted-text"}
                />
              </div>
              <div className="insight-info">
                <span className="insight-label">Attention Needed</span>
                <span
                  className={`insight-value ${
                    overdueTasks > 0 ? "danger-text" : ""
                  }`}
                >
                  {overdueTasks}
                </span>
                <span className="insight-sub">
                  {overdueTasks > 0
                    ? "Critical overdue tasks require review"
                    : "No overdue tasks currently"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDistributionChart;
