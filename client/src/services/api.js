import axios from "axios";

// This will now correctly read the environment variable for Vite
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is essential for sending cookies (like session cookies)
});

// Automatically attach the token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Optional: Add a response interceptor for error handling, e.g., redirect on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      console.error("Authentication error (401):", error.response.data.message);
      localStorage.removeItem("token");
      // You might want to navigate to login here using `useNavigate()` if in a component,
      // or a more global state management solution if outside of a component.
      // window.location.href = "/login"; // This is a simple but forceful way to redirect
    }
    return Promise.reject(error);
  }
);

export default api;