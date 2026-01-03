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
  getCurrentUser: () => api.get("/users/me"),
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
};

export default api;
