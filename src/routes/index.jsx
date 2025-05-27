import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<SignUp />} />
      </Route>

      {/* Protected Routes with Navbar */}
      <Route element={<PrivateRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="to-buy" element={<ToBuy />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="history" element={<History />} />
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

export default router;
