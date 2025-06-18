import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserInfoContext from "../Context/User/UserInfoContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(UserInfoContext);
  console.log("[AdminRoute] user:", user);
  // Adjust the property name if your user object uses something else for admin
  if (user && (user.isAdmin || user.email === "admin@admin.com")) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;
