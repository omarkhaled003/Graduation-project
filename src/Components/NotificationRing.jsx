import { useNavigate, useLocation } from "react-router-dom";
import { FiBell } from "react-icons/fi";

export default function NotificationRing() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === "/notifications";

  return (
    <div
      className="flex items-center justify-center cursor-pointer"
      title="Notifications"
      onClick={() => navigate("/notifications")}
    >
      <FiBell
        className={`h-6 w-6 ${isActive ? "text-blue-500" : "text-gray-400"}`}
      />
    </div>
  );
}
