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

// Grievance endpoints
export const grievanceAPI = {
  // For FormData requests, override default Content-Type so the browser sets the boundary
  start: (formData) => api.post('/grievance/start', formData, { headers: { 'Content-Type': undefined } }),
  clarify: (payload) => {
    // Some backends expect the user's answers in a `user_response` query param.
    try {
      if (payload && payload.answers) {
        const qr = encodeURIComponent(JSON.stringify(payload.answers));
        return api.post(`/grievance/clarify?user_response=${qr}`, payload);
      }
    } catch (e) {
      // fallback to plain post
    }
    return api.post('/grievance/clarify', payload);
  },
  getSession: (sessionId) => api.get(`/grievance/session/${sessionId}`),
  submit: (payload) => api.post('/grievance/submit', payload),
  getForm: (formId) => api.get(`/grievance/form/${formId}`),
  getForms: () => api.get('/grievance/forms'),
  // Citizen confirm resolution: try form-specific confirm, fallback to generic endpoint
  confirmResolution: async (formId) => {
    try {
      return await api.post(`/grievance/form/${formId}/confirm`, { form_id: formId });
    } catch (e) {
      // fallback
      return api.post('/grievance/confirm', { form_id: formId });
    }
  },
};

// Officer / Resolution endpoints
export const officerAPI = {
  // Get officer dashboard with assigned tickets
  getDashboard: () => api.get('/resolution/officer/dashboard'),
  // Update ticket status: payload { grievance_id, new_status, progress_note }
  updateStatus: (payload) => api.patch('/resolution/officer/update-status', payload),
};

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
