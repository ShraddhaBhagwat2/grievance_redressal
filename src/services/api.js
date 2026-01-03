import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://matching-mice-flowers-operational.trycloudflare.com";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const authAPI = {
  signup: (userData) => api.post("/users/signup", userData),
  login: (credentials) => api.post("/users/login", credentials),
  adminLogin: (credentials) => api.post("/superuser/auth/auth/login", credentials),
  getCurrentUser: () => api.get("/users/me"),
  getAdminProfile: () => api.get("/superuser/auth/auth/profile"),
  changeAdminPassword: (data) => api.post("/superuser/auth/auth/change-password", data),
  adminLogout: () => api.post("/superuser/auth/auth/logout"),
};

// Admin API functions
export const adminAPI = {
  // Create a new staff user
  createUser: (userData) => api.post("/superuser/admin/admin/create-user", userData),
  
  // Get list of users with filters
  getUsers: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.dept) params.append("dept", filters.dept);
    if (filters.ward) params.append("ward", filters.ward);
    if (filters.role) params.append("role", filters.role);
    params.append("page", filters.page || 1);
    params.append("page_size", filters.page_size || 10);
    return api.get(`/superuser/admin/admin/users?${params.toString()}`);
  },
  
  // Get specific user details
  getUserDetails: (staffId) => api.get(`/superuser/admin/admin/users/${staffId}`),
  
  // Update user's jurisdiction
  updateJurisdiction: (data) => api.put("/superuser/admin/admin/update-jurisdiction", data),
};

export default api;
