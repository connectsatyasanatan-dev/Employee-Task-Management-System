import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-card text-center">
        <div className="login-icon-wrapper stat-icon-warning">
          <AlertTriangle size={32} />
        </div>
        <h1 className="login-title">Page Not Found</h1>
        <p className="login-subtitle mb-4">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
