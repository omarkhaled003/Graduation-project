import { useNavigate, useLocation } from "react-router-dom";
import { FiBell } from "react-icons/fi";

export default function NotificationRing() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === "/notifications";

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer p-2 hover:bg-[#2A2A2A] rounded-full transition-colors"
      title="Notifications"
      onClick={() => navigate("/notifications")}
    >
      <FiBell
        className={`h-6 w-6 ${isActive ? "text-blue-500" : "text-gray-400"}`}
      />
      {/* Notification Badge */}
      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
    </div>
  );
}
