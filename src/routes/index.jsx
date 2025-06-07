import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import { useContext } from "react";
import UserInfoContext from "../Context/User/UserInfoContext";
import MainLayout from "../layouts/MainLayout/index.jsx";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Login/";
import SignUp from "../pages/SignUp/index.jsx";
import PrivateRoutes from "./PrivateRoutes";
import ToBuy from "../pages/ToBuy/ToBuy";
import Reports from "../pages/Reports/Reports";
import Notifications from "../pages/Notifications";
import Dashboard from "../pages/Dashboard/Dashboard";
import History from "../pages/History.jsx";
import BestPrice from "../pages/BestPrice/BestPrice.jsx";
import ProductDetails from "../pages/ProductDetails/ProductDetails.jsx";

const AuthRedirector = () => {
  const { user } = useContext(UserInfoContext);
  console.log("AuthRedirector: User state on render:", user);

  if (user && user.token) {
    console.log(
      "AuthRedirector: User is authenticated, redirecting to /dashboard"
    );
    return <Navigate to="/dashboard" replace />;
  }
  console.log(
    "AuthRedirector: User is NOT authenticated, redirecting to /login"
  );
  return <Navigate to="/login" replace />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Root path will now use AuthRedirector to decide where to go */}
      <Route index element={<AuthRedirector />} />

      {/* Public Routes - now only for specific paths */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<SignUp />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoutes />}>
        {/* All routes nested here will use MainLayout as their parent */}
        <Route element={<MainLayout />}>
          {/* Dashboard is now a specific protected route */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="to-buy" element={<ToBuy />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="history" element={<History />} />
          <Route path="best-price/:listid" element={<BestPrice />} />
          <Route path="product-details/:id" element={<ProductDetails />} />
        </Route>
      </Route>

      {/* Catch all route - redirects to root which AuthRedirector handles */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

export default router;
