import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import UserInfoContext from "../../Context/User/UserInfoContext";

const PrivateRoutes = () => {
  const { user } = useContext(UserInfoContext);

  return user && user.token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
