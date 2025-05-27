import React from "react";

const notifications = [
  {
    icon: "✔️",
    title: "You Achieved your Saving Goal !",
    time: "Today 3:30PM",
    color: "text-green-400",
    bg: "bg-blue-900",
  },
  {
    icon: "ℹ️",
    title: "You reached 70% of Spending Limit",
    time: "Yesterday 7:30AM",
    color: "text-yellow-400",
    bg: "bg-blue-900",
  },
  {
    icon: "ℹ️",
    title: "You reached 60% of Spending Limit",
    time: "Monday 8:30PM",
    color: "text-yellow-400",
    bg: "bg-blue-900",
  },
  {
    icon: "ℹ️",
    title: "You reached 50% of Spending Limit",
    time: "Friday 6:20PM",
    color: "text-yellow-400",
    bg: "bg-blue-900",
  },
];

export default function Notifications() {
  return (
    <div className="p-8 min-h-screen bg-[#101622] flex flex-col flex-1 h-full">
      <div className="flex justify-end mb-4">
        {/* You can add a bell icon or notification icon here if desired */}
      </div>
      <div className="space-y-8">
        {notifications.map((n, i) => (
          <div
            key={i}
            className={`rounded-2xl ${n.bg} p-6 flex flex-col shadow-lg`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-2xl ${n.color}`}>{n.icon}</span>
              <span className="text-white font-semibold text-lg">
                {n.title}
              </span>
            </div>
            <span className="text-gray-400 text-sm">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
