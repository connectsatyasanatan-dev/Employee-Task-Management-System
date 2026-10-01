import apiClient from "./client";
let refreshPromise = null;

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/api/auth/login", { email, password });
    return response.data;
  },

  refresh: async () => {
    if (!refreshPromise) {
      refreshPromise = apiClient
        .post("/api/auth/refresh")
        .then((response) => response.data)
        .finally(() => {
          refreshPromise = null;
        });
    }
    return refreshPromise;
  },

  logout: async () => {
    const response = await apiClient.post("/api/auth/logout");
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/api/auth/me");
    return response.data;
  },
};

export default authApi;

