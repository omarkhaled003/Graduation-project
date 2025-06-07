import { useEffect, useState } from "react";

const UserInfoComponent = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={user.image || "https://i.pravatar.cc/150?img=1"}
          alt={user.name || "User"}
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
        />
        {/* Status dot (optional) */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
      </div>
      <div className="text-right">
        <div className="text-white font-semibold text-sm">
          {user.name || "User"}
        </div>
        <div className="text-gray-400 text-xs">
          {user.email || "user@example.com"}
        </div>
      </div>
    </div>
  );
};

export default UserInfoComponent;
