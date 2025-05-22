import axios from "axios";

const api = axios.create({
  baseURL: "https://universe-backend-2yh9.onrender.com",
});

// Automatically attach the token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
