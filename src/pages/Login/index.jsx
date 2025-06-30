import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import UserInfoContext from "../../Context/User/UserInfoContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserInfoContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Attempting login with:", { username, password });

    try {
      const response = await axios.post(
        "/api/User/Login",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Login response:", response.data);

      if (response.data) {
        console.log("[Login] username:", username);
        const isAdmin =
          (response.data.roles &&
            Array.isArray(response.data.roles) &&
            response.data.roles.includes("Admin")) ||
          response.data.email === "admin@admin.com" ||
          username === "admin@admin.com";
        const userObj = {
          ...response.data,
          isAdmin,
          email: response.data.email || username,
        };
        console.log("[Login] userObj to be saved:", userObj);
        login(userObj);
        navigate("/");
      } else {
        console.log("Invalid response data");
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response) {
        setError(
          error.response.data.message ||
            "Login failed. Please check your credentials."
        );
      } else if (error.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-[#18181b] rounded-xl p-4 mb-4 w-full max-w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Login
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="username"
            ></label>
            <div className="relative">
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="shadow appearance-none border border-gray-700 rounded-full w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:shadow-outline bg-[#334155]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FiUser
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="shadow appearance-none border border-gray-700 rounded-full w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:shadow-outline bg-[#334155]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
