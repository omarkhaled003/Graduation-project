import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const Reports = () => {
  const [activeChart, setActiveChart] = useState("donut");

  // Revenue data
  const revenueData = [
    { day: "01", income: 200, expense: 150 },
    { day: "02", income: 300, expense: 200 },
    { day: "03", income: 200, expense: 180 },
    { day: "04", income: 280, expense: 220 },
    { day: "05", income: 250, expense: 200 },
    { day: "06", income: 300, expense: 250 },
    { day: "07", income: 350, expense: 300 },
  ];

  // Weekly expense data
  const expenseData = [
    { category: "Food & Drink", value: 758.2, color: "#4ADE80" },
    { category: "Shopping", value: 700, color: "#FB7185" },
    { category: "Transportation", value: 758.2, color: "#FB923C" },
    { category: "Others", value: 758.2, color: "#38BDF8" },
  ];

  // Daily expense data
  const dailyExpenseData = [
    { day: "01", food: 300, transport: 200, others: 150 },
    { day: "02", food: 400, transport: 300, others: 200 },
    { day: "03", food: 350, transport: 250, others: 180 },
    { day: "04", food: 450, transport: 350, others: 220 },
    { day: "05", food: 300, transport: 200, others: 170 },
    { day: "06", food: 380, transport: 280, others: 190 },
    { day: "07", food: 420, transport: 320, others: 210 },
  ];

  const total = expenseData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2A2A2A] p-2 rounded-lg border border-gray-600">
          {payload.map((entry, index) => (
            <div key={index} className="text-sm text-white">
              <span className="capitalize">{entry.name}</span>: ${entry.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Revenue Section */}
      <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
        <div>
          <h2 className="text-white text-xl font-semibold">Revenue</h2>
          <p className="text-gray-400 text-sm">Data from 1-7 Apr 2024</p>
          <div className="text-2xl font-bold text-white mt-2">$1,275.30</div>
        </div>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} barGap={0}>
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#4ADE80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#FB7185" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4ADE80]" />
            <span className="text-gray-400">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FB7185]" />
            <span className="text-gray-400">Expense</span>
          </div>
        </div>
      </div>

      {/* Weekly Expense and Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Expense Section */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div>
              <h2 className="text-white text-xl font-semibold">
                Weekly Expense
              </h2>
              <p className="text-gray-400 text-sm">from 17 Apr 2024</p>
            </div>
            <div className="bg-[#2A2A2A] rounded-full p-1 flex space-x-1">
              <button
                onClick={() => setActiveChart("donut")}
                className={`px-4 py-1 rounded-full transition-colors ${
                  activeChart === "donut"
                    ? "bg-[#3A3A3A] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Donut
              </button>
              <button
                onClick={() => setActiveChart("bar")}
                className={`px-4 py-1 rounded-full transition-colors ${
                  activeChart === "bar"
                    ? "bg-[#3A3A3A] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Bar
              </button>
            </div>
          </div>

          <div className="h-[200px]">
            {activeChart === "donut" ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="24"
                  >
                    {total.toFixed(0)}
                  </text>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyExpenseData}>
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="food" stackId="a" fill="#4ADE80" />
                  <Bar dataKey="transport" stackId="a" fill="#FB923C" />
                  <Bar dataKey="others" stackId="a" fill="#38BDF8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expenseData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-400">{item.category}</span>
                <span className="text-white font-medium">
                  ${item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          {/* Spending Limit Section */}
          <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
            <h2 className="text-white text-xl font-semibold">Spending Limit</h2>
            <p className="text-gray-400 text-sm">Data from 1-7 Apr 2024</p>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-white font-medium">$252.55</span>
                <span className="text-gray-400">of $1,500</span>
              </div>
              <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                  style={{ width: "35%" }}
                />
              </div>
            </div>
          </div>

          {/* Saving Goal Section */}
          <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
            <h2 className="text-white text-xl font-semibold">Saving Goal</h2>
            <p className="text-gray-400 text-sm">Data from 1-7 Apr 2024</p>
            <div className="flex justify-center mt-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2A2A2A"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="3"
                    strokeDasharray="35, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">$252.55</div>
                    <div className="text-sm text-gray-400">of $1,200</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Expense Section */}
      <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
        <h2 className="text-white text-xl font-semibold">Daily Expense</h2>
        <p className="text-gray-400 text-sm">Data from 1-7 Apr 2024</p>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyExpenseData}>
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="food" stackId="a" fill="#4ADE80" />
              <Bar dataKey="transport" stackId="a" fill="#FB923C" />
              <Bar dataKey="others" stackId="a" fill="#38BDF8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4ADE80]" />
            <span className="text-gray-400">Food & Drink</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FB923C]" />
            <span className="text-gray-400">Transportation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#38BDF8]" />
            <span className="text-gray-400">Others</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
