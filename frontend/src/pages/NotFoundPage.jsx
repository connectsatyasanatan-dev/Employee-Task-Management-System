import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-card" style={{ textAlign: "center" }}>
        <div className="login-icon-wrapper" style={{ backgroundColor: "var(--warning-light)", color: "var(--warning)" }}>
          <AlertTriangle size={32} />
        </div>
        <h1 className="login-title">Page Not Found</h1>
        <p className="login-subtitle" style={{ marginBottom: 24 }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary" style={{ display: "inline-flex", width: "auto" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
