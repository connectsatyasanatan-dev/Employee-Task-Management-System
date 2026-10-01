import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, Layers, Loader, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const LoginPage = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.detail || "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <Layers size={28} />
          </div>
          <h1 className="login-title">TaskFlow Enterprise</h1>
          <p className="login-subtitle">
            Sign in to access your organization's workspace
          </p>
        </div>

        {error && (
          <div className="alert-danger" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Work Email Address
            </label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Account Password
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={16} className="spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Quick Test Login Helper */}
        <div className="login-quick-demo">
          <span className="demo-helper-title">Quick Demo Login</span>
          <div className="demo-pills-row">
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickFill("admin@organization.com", "AdminPass123!")}
              title="Fill Admin credentials"
            >
              <ShieldCheck size={14} className="text-primary" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              className="demo-pill-btn"
              onClick={() => handleQuickFill("sarah.chen@techcorp.io", "Pass#Chen2026")}
              title="Fill Employee credentials"
            >
              <User size={14} className="text-muted" />
              <span>Employee Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
