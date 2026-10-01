import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as ChartIcon } from "lucide-react";

const STATUS_COLORS = {
  Pending: "#f59e0b",
  "In Progress": "#3b82f6",
  Completed: "#10b981",
  Overdue: "#ef4444",
};

export const TaskDistributionChart = ({ stats }) => {
  const data = [
    { name: "Pending", value: stats?.pending_tasks || 0, color: STATUS_COLORS.Pending },
    { name: "In Progress", value: stats?.in_progress_tasks || 0, color: STATUS_COLORS["In Progress"] },
    { name: "Completed", value: stats?.completed_tasks || 0, color: STATUS_COLORS.Completed },
    { name: "Overdue", value: stats?.overdue_tasks || 0, color: STATUS_COLORS.Overdue },
  ].filter((item) => item.value > 0);

  const totalTasks = stats?.total_tasks || 0;

  if (totalTasks === 0 || data.length === 0) {
    return (
      <div className="card chart-card">
        <div className="card-header">
          <h2 className="card-title">Task Status Breakdown</h2>
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
    <div className="card chart-card">
      <div className="card-header">
        <h2 className="card-title">Task Status Breakdown</h2>
        <span className="card-badge">{totalTasks} Total Tasks</span>
      </div>

      <div className="chart-wrapper">
        <div className="chart-container-box">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
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
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Accessible Text Legend & Percentages */}
        <div className="chart-legend-grid">
          {data.map((item) => {
            const percentage = totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(0) : 0;
            return (
              <div key={item.name} className="legend-item">
                <div className="legend-header">
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="legend-label">{item.name}</span>
                </div>
                <div className="legend-value-row">
                  <span className="legend-count">{item.value}</span>
                  <span className="legend-percentage">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskDistributionChart;
