import { useState, useEffect } from "react";
import UserInfoContext from "./UserInfoContext";

export default function UserInfoProvider({ children }) {
  // const [userName, setUserName] = useState("");
  // const [Pass, setPass] = useState("");
  const [isLogin, setIsLogin] = useState(() => {
    // Check if user/token exists in localStorage
    const user = localStorage.getItem("user");
    return !!user;
  });

  useEffect(() => {
    // On mount, always sync isLogin with localStorage
    setIsLogin(!!localStorage.getItem("user"));
  }, []);

  useEffect(() => {
    // Sync isLogin with localStorage changes
    const handleStorage = () => {
      setIsLogin(!!localStorage.getItem("user"));
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
    setIsLogin,
  };
  console.log({ isLogin });

  return (
    <UserInfoContext.Provider value={values}>
      {children}
    </UserInfoContext.Provider>
  );
}
