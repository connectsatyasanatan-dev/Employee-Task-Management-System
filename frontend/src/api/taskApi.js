import apiClient from "./client";

export const taskApi = {
  getTasks: async (params = {}) => {
    const response = await apiClient.get("/api/tasks", { params });
    return response.data;
  },

  createTask: async (data) => {
    const response = await apiClient.post("/api/tasks", data);
    return response.data;
  },

  getTask: async (id) => {
    const response = await apiClient.get(`/api/tasks/${id}`);
    return response.data;
  },

  updateTask: async (id, data) => {
    const response = await apiClient.put(`/api/tasks/${id}`, data);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await apiClient.patch(`/api/tasks/${id}/status`, {
      status,
    });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await apiClient.delete(`/api/tasks/${id}`);
    return response.data;
  },
};

export default taskApi;
