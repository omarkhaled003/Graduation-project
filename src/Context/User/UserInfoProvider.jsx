import { useState, useEffect, createContext } from "react";
import UserInfoContext from "./UserInfoContext";

export default function UserInfoProvider({ children }) {
  // const [userName, setUserName] = useState("");
  // const [Pass, setPass] = useState("");
  const [isLogin, setIsLogin] = useState(() => {
    // Check if user/token exists in localStorage
    const user = localStorage.getItem("user");
    return !!user;
  });
  const [userData, setUserData] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUserData(userData);
    setIsLogin(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUserData(null);
    setIsLogin(false);
  };

  useEffect(() => {
    // On mount, sync with localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    // Sync with localStorage changes
    const handleStorage = () => {
      const user = localStorage.getItem("user");
      if (user) {
        setUserData(JSON.parse(user));
        setIsLogin(true);
      } else {
        setUserData(null);
        setIsLogin(false);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    console.log("[Provider] isLogin:", isLogin);
  }, [isLogin]);

  // shared state for all app
  const values = {
    // userName,
    // setUserName,
    // Pass,
    // setPass,
    isLogin,
    userData,
    login,
    logout,
  };
  console.log({ isLogin });

  return (
    <UserInfoContext.Provider value={values}>
      {children}
    </UserInfoContext.Provider>
  );
}
