import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Basic validation (replace with actual authentication logic later)
    if (email && password) {
      console.log(
        "Logging in with:",
        email,
        password,
        "Remember Me:",
        rememberMe
      );
      // Simulate successful login and navigate to dashboard
      navigate("/dashboard");
    } else {
      alert("Please enter both email and password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-[#1E1E1E] p-8 rounded-lg shadow-md w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="email"
            ></label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Email ID"
                className="shadow appearance-none border border-gray-700 rounded-full w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:shadow-outline bg-[#334155]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FiMail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="password"
            ></label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="shadow appearance-none border border-gray-700 rounded-full w-full py-3 px-4 pl-10 pr-10 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline bg-[#334155]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2 leading-tight"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="text-sm text-gray-400" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link
              to="#"
              className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-600"
            >
              forgot password?
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-white hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline w-full"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <span className="text-gray-400">Dont have an account? </span>
          <Link
            to="/register"
            className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-600"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
