import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout/index.jsx";
import AuthLayout from "../layouts/AuthLayout/AuthLayout.jsx";
import Login from "../pages/Login/index.jsx";
import SignUp from "../pages/SignUp/index.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Reports from "../pages/Reports/Reports.jsx";
import History from "../pages/History.jsx";
import ToBuy from "../pages/ToBuy/ToBuy.jsx";
import PrivateRoutes from "./PrivateRoutes/index.jsx";
import EditProfile from "../pages/EditProfile.jsx";
import BestPrice from "../pages/BestPrice/BestPrice.jsx";
import ProductDetails from "../pages/ProductDetails/ProductDetails.jsx";
import Notifications from "../pages/Notifications.jsx";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.jsx";
import AdminPanel from "../pages/AdminPanel/AdminPanel.jsx";
import AdminRoute from "./AdminRoute.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Public Routes - now only for specific paths */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="register" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoutes />}>
        {/* All routes nested here will use MainLayout as their parent */}
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="history" element={<History />} />
          <Route path="to-buy" element={<ToBuy />} />
          <Route path="best-price/:listid" element={<BestPrice />} />
          <Route path="product-details/:id" element={<ProductDetails />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Route>
      </Route>

      {/* Catch-all for undefined routes within the app */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Route>
  )
);

export default router;
