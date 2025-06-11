import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "/api", // This will be proxied by Vite to your backend
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 600000,
});

// Add request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage in interceptor:", error);
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Network error occurred:", error);
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error);
    }
    // You might want to add more sophisticated error handling here,
    // e.g., redirecting to login on 401 Unauthorized
    return Promise.reject(error);
  }
);

export default api; 