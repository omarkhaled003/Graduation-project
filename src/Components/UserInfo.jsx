import { useEffect, useState } from "react";

const UserInfo = () => {
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    image: "https://i.pravatar.cc/150?img=1",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={user.image}
          alt={user.firstName}
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
        />
        {/* Status dot (optional) */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
      </div>
      <div className="text-right">
        <div className="text-white font-semibold text-sm">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-gray-400 text-xs">{user.email}</div>
      </div>
    </div>
  );
};

export default UserInfo;
