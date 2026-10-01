import apiClient from "./client";

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/api/auth/login", { email, password });
    return response.data;
  },

  refresh: async () => {
    const response = await apiClient.post("/api/auth/refresh");
    return response.data;
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
