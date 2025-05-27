import { Outlet } from "react-router-dom";

export default function PrivateRoutes() {
  // Auth temporarily disabled: always allow access
  return <Outlet />;
}
