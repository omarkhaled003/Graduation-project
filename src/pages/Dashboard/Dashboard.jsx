import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FiShoppingBag } from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();

  // Sample data based on the image
  const revenue = "EGP 20.000";
  const expenses = "EGP 10.000";
  const moneyLeft = "EGP 10.000";
  const totalPoints = "1500";

  const expenseCategories = [
    { name: "Search Engine", value: 2234, color: "#38BDF8" },
    { name: "Food & Drinks", value: 243, color: "#4ADE80" },
    { name: "Email", value: 641, color: "#FB923C" },
    { name: "Clothes", value: 1554, color: "#FB7185" },
  ];

  const totalExpense = expenseCategories.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const latestOrders = [
    {
      id: 1,
      product: "Hat",
      quantity: 2,
      date: "Jun 29,2022",
      shopName: "Tree",
      category: "clothes",
      price: 400.0,
      categoryColor: "#4ADE80",
    },
    {
      id: 2,
      product: "Mackbook Pro",
      quantity: 1,
      date: "Jun 29,2022",
      shopName: "Electronics",
      category: "Pending",
      price: 288.0,
      categoryColor: "#FB923C",
    },
    {
      id: 3,
      product: "Meat",
      quantity: 1,
      date: "Jun 29,2022",
      shopName: "Gomla Market",
      category: "food",
      price: 500.0,
      categoryColor: "#FB7185",
    },
    {
      id: 4,
      product: "Jeans",
      quantity: 2,
      date: "Jun 29,2022",
      shopName: "American Eagle",
      category: "clothes",
      price: 100.0,
      categoryColor: "#4ADE80",
    },
    {
      id: 5,
      product: "Jacket",
      quantity: 1,
      date: "Jun 29,2022",
      shopName: "American Eagle",
      category: "Clothes",
      price: 60.0,
      categoryColor: "#4ADE80",
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2A2A2A] p-2 rounded-lg border border-gray-600">
          <div className="text-sm text-white">
            {payload[0].name}: ${payload[0].value}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="mb-0">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* To Buy Card */}
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <h3 className="text-gray-400 text-sm">Revenue</h3>
          <div className="text-2xl font-bold text-white mt-2">{revenue}</div>
        </div>
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <h3 className="text-gray-400 text-sm">Expenses</h3>
          <div className="text-2xl font-bold text-white mt-2">{expenses}</div>
          <div className="text-blue-400 text-xs mt-2">150%</div>
        </div>
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <h3 className="text-gray-400 text-sm">Money Left</h3>
          <div className="text-2xl font-bold text-white mt-2">{moneyLeft}</div>
          <div className="text-blue-400 text-xs mt-2">50%</div>
        </div>
      </div>

      {/* Charts and Latest Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Donut Chart Section */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-semibold">
              Expenses Breakdown
            </h2>
            <div className="text-white text-2xl font-bold">{totalExpense}</div>
          </div>
          <div className="h-[250px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseCategories.map((entry, index) => (
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
                  {totalExpense}
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
              {expenseCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Orders Section */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            Latest Orders
          </h2>
          <div className="space-y-4">
            {latestOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: order.categoryColor }}
                  />
                  <div>
                    <p className="text-white font-medium">{order.product}</p>
                    <p className="text-gray-400 text-sm">
                      {order.shopName} • {order.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    EGP {order.price.toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-sm">Qty: {order.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
