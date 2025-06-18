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
    const originalRequest = error.config;
    // If 401 and not already trying to refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.token && user?.refreshToken) {
          // Attempt to refresh token
          const refreshResponse = await api.post("/User/RefreshToken", {
            accessToken: user.token,
            refreshToken: user.refreshToken,
          });
          const { token, refreshToken } = refreshResponse.data;
          // Update localStorage
          const newUser = { ...user, token, refreshToken };
          localStorage.setItem("user", JSON.stringify(newUser));
          // Update Authorization header and retry original request
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed: clear user and redirect to login
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    if (error.code === "ERR_NETWORK") {
      console.error("Network error occurred:", error);
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error);
    }
    return Promise.reject(error);
  }
);

export default api; 