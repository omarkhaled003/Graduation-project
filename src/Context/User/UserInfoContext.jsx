import { createContext, useState, useEffect } from "react";

const UserInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage on component mount
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  const login = (userData) => {
    // This will be where you handle successful login and update user state
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage
    console.log("User logged in:", userData);
  };

  const logout = () => {
    // This will be where you handle logout
    setUser(null);
    localStorage.removeItem("user");
    console.log("User logged out");
  };

  return (
    <UserInfoContext.Provider value={{ user, login, logout }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoContext;
