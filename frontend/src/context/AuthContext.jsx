import { createContext, useEffect, useState, useCallback } from "react";
import authApi from "../api/authApi";
import { setInMemoryToken } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load using HttpOnly refresh cookie
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const data = await authApi.refresh();
        if (isMounted && data.access_token) {
          setInMemoryToken(data.access_token);
          setAccessToken(data.access_token);
          setUser(data.user);
        }
      } catch {
        if (isMounted) {
          setInMemoryToken(null);
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setInMemoryToken(data.access_token);
    setAccessToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout API errors and clear local state
      console.warn("Logout error:", err);
    } finally {
      setInMemoryToken(null);
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const isAuthenticated = Boolean(user && accessToken);
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    accessToken,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
