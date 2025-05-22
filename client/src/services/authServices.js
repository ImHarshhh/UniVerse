import api from "./api";

// Login
export const login = async (credentials) => {
  const res = await api.post("/api/auth/login", credentials);
  return res.data;
};

// Signup
export const signup = async (userData) => {
  const res = await api.post("/api/auth/signup", userData);
  return res.data;
};

// Logout
export const logout = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};

// Get current logged-in user
export const getCurrentUser = async () => {
  const res = await api.get("/api/users/me");
  return res.data;
};
