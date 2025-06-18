import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import UserInfoContext from "../../Context/User/UserInfoContext";

const PrivateRoutes = () => {
  const { user } = useContext(UserInfoContext);

  console.log("PrivateRoutes: user object from context", user);

  return user && user.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
