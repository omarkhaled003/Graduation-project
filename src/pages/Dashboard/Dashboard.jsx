import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FiShoppingBag, FiEdit, FiTrash2 } from "react-icons/fi";
import UserInfoContext from "../../Context/User/UserInfoContext";
import api from "../../utils/api"; // Import the shared API instance
import { categories } from "../History"; // Import categories from History page

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserInfoContext);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productNameFilter, setProductNameFilter] = useState("");
  const [shopFilter, setShopFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [searchType, setSearchType] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const applyFiltersToProducts = (products) => {
    return products.filter((product) => {
      const matchesProductName =
        !productNameFilter ||
        (product?.productName &&
          product.productName
            .toLowerCase()
            .includes(productNameFilter.toLowerCase()));

      const matchesShopName =
        !shopFilter ||
        (product?.shopName &&
          product.shopName.toLowerCase().includes(shopFilter.toLowerCase()));

      const matchesCategory =
        !categoryFilter ||
        product?.category?.toLowerCase() === categoryFilter.toLowerCase();

      const productDate = product?.date ? new Date(product.date) : null;
      const start = startDateFilter ? new Date(startDateFilter) : null;
      const end = endDateFilter ? new Date(endDateFilter) : null;

      const matchesDateRange =
        (!start || (productDate && productDate >= start)) &&
        (!end || (productDate && productDate <= end));

      if (!searchType) {
        return (
          matchesProductName &&
          matchesShopName &&
          matchesCategory &&
          matchesDateRange
        );
      } else if (searchType === "productName") {
        return matchesProductName;
      } else if (searchType === "shopName") {
        return matchesShopName;
      } else if (searchType === "category") {
        return matchesCategory;
      } else if (searchType === "dateRange") {
        return matchesDateRange;
      }
      return true;
    });
  };

  const fetchPurchasedProducts = async (isInitialLoad = false) => {
    if (!user || !user.token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/PurchasedProduct/GetPurchasedProducts");
      let productsToFilter = response.data;

      if (isInitialLoad) {
        productsToFilter = productsToFilter.slice(-10);
      }

      setPurchasedProducts(productsToFilter);

      const filteredAndDisplayed = applyFiltersToProducts(productsToFilter);
      setDisplayedProducts(filteredAndDisplayed);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedProducts(true);
  }, [user]);

  const handleSearch = () => {
    setLoading(true);
    setError(null);
    fetchPurchasedProducts(false);
  };

  const handleDelete = async (id) => {
    if (!user || !user.token) {
      setError("User not authenticated.");
      return;
    }
    try {
      await api.delete(`/PurchasedProduct/DeletePurchasedProduct?id=${id}`);
      fetchPurchasedProducts(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditFormData({ ...product });
  };

  const handleUpdateProduct = async () => {
    if (!user || !user.token) {
      setError("User not authenticated.");
      return;
    }
    try {
      const response = await api.put(
        `/PurchasedProduct/UpdatePurchasedProduct?id=${editingProductId}`,
        editFormData
      );

      fetchPurchasedProducts(false);
      setEditingProductId(null);
      setEditFormData({});
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

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
                  <p className="text-white font-medium">${order.price}</p>
                  <p className="text-blue-400 text-xs">{order.quantity} pcs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Purchased Products Table */}
      <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6 mt-6">
        <h2 className="text-white text-xl font-semibold mb-4">
          Purchased Products
        </h2>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="searchType"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Search By:
            </label>
            <select
              id="searchType"
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setProductNameFilter("");
                setShopFilter("");
                setCategoryFilter("");
                setStartDateFilter("");
                setEndDateFilter("");
              }}
              className="w-full p-2 rounded-md bg-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select Search Type</option>
              <option value="productName">Product Name</option>
              <option value="shopName">Shop Name</option>
              <option value="category">Category</option>
              <option value="dateRange">Date Range</option>
            </select>
          </div>

          {searchType === "productName" && (
            <input
              type="text"
              placeholder="Search by product name..."
              value={productNameFilter}
              onChange={(e) => setProductNameFilter(e.target.value)}
              className="w-full p-2 rounded-md bg-[#2A2A2A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          )}

          {searchType === "shopName" && (
            <input
              type="text"
              placeholder="Search by shop name..."
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
              className="w-full p-2 rounded-md bg-[#2A2A2A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          )}

          {searchType === "category" && (
            <select
              id="category"
              name="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 rounded-md bg-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}

          {searchType === "dateRange" && (
            <>
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Start Date:
                </label>
                <input
                  type="date"
                  id="startDate"
                  placeholder="Start Date..."
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#2A2A2A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  End Date:
                </label>
                <input
                  type="date"
                  id="endDate"
                  placeholder="End Date..."
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#2A2A2A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </>
          )}

          {(searchType === "productName" ||
            searchType === "shopName" ||
            searchType === "category" ||
            searchType === "dateRange") && (
            <button
              onClick={handleSearch}
              className="w-full p-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Search
            </button>
          )}
        </div>

        {loading && <p className="text-white">Loading products...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && displayedProducts.length === 0 && (
          <p className="text-gray-400">No purchased products found.</p>
        )}

        {!loading && !error && displayedProducts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1E1E1E] rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#2A2A2A] text-gray-400 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Product Name</th>
                  <th className="py-3 px-6 text-left">Quantity</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-left">Shop Name</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white text-sm font-light">
                {displayedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-600 hover:bg-[#2A2A2A]"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {editingProductId === product.id ? (
                        <input
                          type="text"
                          name="productName"
                          value={editFormData.productName || ""}
                          onChange={handleFormChange}
                          className="bg-[#2A2A2A] text-white p-1 rounded w-full"
                        />
                      ) : (
                        product.productName
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editingProductId === product.id ? (
                        <input
                          type="number"
                          name="quantity"
                          value={editFormData.quantity || ""}
                          onChange={handleFormChange}
                          className="bg-[#2A2A2A] text-white p-1 rounded w-full"
                        />
                      ) : (
                        product.quantity
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editingProductId === product.id ? (
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price || ""}
                          onChange={handleFormChange}
                          className="bg-[#2A2A2A] text-white p-1 rounded w-full"
                        />
                      ) : (
                        `$${product.price.toFixed(2)}`
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editingProductId === product.id ? (
                        <input
                          type="text"
                          name="shopName"
                          value={editFormData.shopName || ""}
                          onChange={handleFormChange}
                          className="bg-[#2A2A2A] text-white p-1 rounded w-full"
                        />
                      ) : (
                        product.shopName
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editingProductId === product.id ? (
                        <input
                          type="date"
                          name="date"
                          value={
                            editFormData.date
                              ? new Date(editFormData.date)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={handleFormChange}
                          className="bg-[#2A2A2A] text-white p-1 rounded w-full"
                        />
                      ) : (
                        new Date(product.date).toLocaleDateString()
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {editingProductId === product.id ? (
                        <input
                          type="text"
                          name="category"
                          value={editFormData.category || ""}
                          onChange={handleFormChange}
                          className="bg-[#2A2A2A] text-white p-1 rounded w-full"
                        />
                      ) : (
                        product.category
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        {editingProductId === product.id ? (
                          <>
                            <button
                              onClick={handleUpdateProduct}
                              className="w-6 mr-2 transform hover:text-green-500 hover:scale-110"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="w-6 transform hover:text-red-500 hover:scale-110"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(product)}
                              className="w-6 mr-2 transform hover:text-blue-500 hover:scale-110"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="w-6 transform hover:text-red-500 hover:scale-110"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
