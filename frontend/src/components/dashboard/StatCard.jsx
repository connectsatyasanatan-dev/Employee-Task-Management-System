export const StatCard = ({
  title,
  value,
  icon: Icon,
  variant = "primary",
  subtitle,
}) => {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-body">
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          <span className="stat-card-value">
            {typeof value === "number" ? value.toLocaleString() : value ?? 0}
          </span>
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
        {Icon && (
          <div className={`stat-card-icon stat-icon-${variant}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
