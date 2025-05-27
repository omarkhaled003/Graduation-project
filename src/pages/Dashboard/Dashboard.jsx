import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const Dashboard = () => {
  // Sample data based on the image
  const revenue = "EGP 20.000";
  const expenses = "EGP 10.000";
  const moneyLeft = "EGP 10.000";
  const totalPoints = "1500";

  const expenseCategories = [
    { name: "Search Engine", value: 2234, color: "#38BDF8" }, // Assuming colors based on Reports page or common chart colors
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
    <div className="p-4 md:p-6 space-y-6 bg-[#121212] min-h-screen text-white">
      {/* Top Bar - Placeholder */}
      {/* Removed placeholder user info and notification icon as they are handled by the MainLayout header */}

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <h3 className="text-gray-400 text-sm">Revenue</h3>
          <div className="text-2xl font-bold text-white mt-2">{revenue}</div>
        </div>
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <h3 className="text-gray-400 text-sm">Expenses</h3>
          <div className="text-2xl font-bold text-white mt-2">{expenses}</div>
          {/* Placeholder for percentage badge */}
          <div className="text-blue-400 text-xs mt-2">150%</div>
        </div>
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <h3 className="text-gray-400 text-sm">Money Left</h3>
          <div className="text-2xl font-bold text-white mt-2">{moneyLeft}</div>
          {/* Placeholder for percentage badge */}
          <div className="text-blue-400 text-xs mt-2">50%</div>
        </div>
        <div className="bg-[#007BFF] rounded-xl p-4 md:p-6 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-white text-sm">Total Points</h3>
            <div className="text-3xl font-bold text-white mt-1">
              {totalPoints}
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Latest Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart Section */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-semibold">
              Expenses Breakdown
            </h2>
            {/* Placeholder for total value if needed */}
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
                {/* Center text for total value if needed */}
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
              {expenseCategories.map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-400">{item.name}</span>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-400">
              <thead>
                <tr className="text-sm text-gray-300 uppercase bg-[#2A2A2A]">
                  <th scope="col" className="px-3 py-2 rounded-l-lg">
                    Product
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Quantity
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Shop Name
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Categories
                  </th>
                  <th scope="col" className="px-3 py-2 rounded-r-lg">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]"
                  >
                    <td className="px-3 py-3 font-medium text-white">
                      {order.product}
                    </td>
                    <td className="px-3 py-3">{order.quantity}</td>
                    <td className="px-3 py-3">{order.date}</td>
                    <td className="px-3 py-3">{order.shopName}</td>
                    <td className="px-3 py-3 flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: order.categoryColor }}
                      />
                      <span>{order.category}</span>
                    </td>
                    <td className="px-3 py-3 text-white">
                      ${order.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
