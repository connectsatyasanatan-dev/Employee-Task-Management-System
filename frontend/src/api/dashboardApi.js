import apiClient from "./client";

export const dashboardApi = {
  getDashboardStats: async () => {
    const response = await apiClient.get("/api/dashboard/stats");
    return response.data;
  },
};

export default dashboardApi;
