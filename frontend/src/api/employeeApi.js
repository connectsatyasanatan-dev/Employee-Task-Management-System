import apiClient from "./client";

export const employeeApi = {
  getEmployees: async (params = {}) => {
    const response = await apiClient.get("/api/employees", { params });
    return response.data;
  },

  createEmployee: async (data) => {
    const response = await apiClient.post("/api/employees", data);
    return response.data;
  },

  getEmployee: async (id) => {
    const response = await apiClient.get(`/api/employees/${id}`);
    return response.data;
  },

  updateEmployee: async (id, data) => {
    const response = await apiClient.put(`/api/employees/${id}`, data);
    return response.data;
  },

  updateEmployeeStatus: async (id, isActive) => {
    const response = await apiClient.patch(`/api/employees/${id}/status`, {
      is_active: isActive,
    });
    return response.data;
  },
};

export default employeeApi;
