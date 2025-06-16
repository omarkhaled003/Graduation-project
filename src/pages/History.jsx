import React, { useState } from "react";
import { FiCalendar, FiUploadCloud } from "react-icons/fi";
import axios from "axios";

const categories = ["Clothes", "Electronics", "Food & Groceries", "Other"];

const monthlyBillCategories = [
  "Rent",
  "Utilities",
  "Loan Payment",
  "Insurance",
  "Other Bills",
];

export { categories, monthlyBillCategories };

const History = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: 1,
    price: "",
    date: "",
    shopName: "",
    receiptImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("scanReceipt"); // New state for active view
  const [success, setSuccess] = useState("");
  const [monthlyBillData, setMonthlyBillData] = useState({
    name: "",
    issuer: "",
    category: "",
    amount: "",
    duration: "",
  });
  const [startDateInput, setStartDateInput] = useState(""); // State for date input string
  const [endDateInput, setEndDateInput] = useState(""); // State for date input string

  const api = axios.create({
    baseURL: "/api",
    timeout: 600000, // 10 minutes
  });

  // Add request interceptor to handle authentication and FormData
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For FormData requests, explicitly set Content-Type to undefined
    // This tells Axios to let the browser handle multipart/form-data with the correct boundary
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = undefined;
    }

    return config;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }
      console.log("File selected:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });
      setFormData((prevState) => ({
        ...prevState,
        receiptImage: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false); // Stop loading if no token
        return;
      }

      if (activeView === "scanReceipt") {
        if (!formData.receiptImage) {
          setError("Please select a file first");
          setLoading(false); // Stop loading if no file
          return;
        }

        console.log("=== Receipt Upload Process ===");
        console.log("1. File Details:", {
          name: formData.receiptImage.name,
          type: formData.receiptImage.type,
          size: `${(formData.receiptImage.size / 1024).toFixed(2)} KB`,
        });

        console.log(
          "File object before FormData append:",
          formData.receiptImage
        );

        const receiptFormData = new FormData();
        receiptFormData.append(
          "formFile",
          formData.receiptImage,
          formData.receiptImage.name
        );

        console.log("2. FormData Contents:");
        for (let pair of receiptFormData.entries()) {
          console.log(pair[0] + ":", pair[1]);
        }

        console.log("3. Sending request to /api/PurchasedProduct/AddReceipt");

        const requestConfig = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        console.log("4. Request Config for AddReceipt:", requestConfig);

        const response = await api.post(
          "/PurchasedProduct/AddReceipt",
          receiptFormData,
          requestConfig
        );

        console.log("4. Response received:", response.data);
        // Only reset receiptImage after successful upload
        setFormData((prev) => ({ ...prev, receiptImage: null }));
        setSuccess("Receipt uploaded successfully!");
      } else if (activeView === "form") {
        // Manual Form submission logic
        const purchaseData = {
          id: 0,
          productName: formData.itemName || "",
          // Category will be one of: "Clothes", "Electronics", "Food & Groceries", or "Other"
          category: formData.category || "",
          date: formData.date || new Date().toISOString().split("T")[0],
          price: parseFloat(formData.price) || 0,
          quantity: parseInt(formData.quantity) || 0,
          shopName: formData.shopName || "",
        };

        console.log(
          "Sending purchase data to /api/PurchasedProduct/AddPurchasedProduct:",
          purchaseData
        );

        const response = await api.post(
          "/PurchasedProduct/AddPurchasedProduct",
          purchaseData, // Axios will automatically handle Content-Type for JSON
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        console.log("Purchase response status:", response.status);
        console.log("Purchase response data:", response.data);

        if (response.status === 200) {
          // Success - clear form and show success message
          setFormData({
            itemName: "",
            category: "",
            quantity: 1,
            price: "",
            date: "",
            shopName: "",
            receiptImage: null,
          });
          setError(null); // Clear any previous errors
          setSuccess("Purchase added successfully!");
        } else {
          throw new Error(
            response.data.message ||
              `Failed to save purchase with status: ${response.status}`
          );
        }
      } else if (activeView === "monthlyBill") {
        // Monthly Bill submission logic
        const now = new Date(); // Get current date and time

        const billData = {
          name: monthlyBillData.name || "",
          issuer: monthlyBillData.issuer || "",
          category: monthlyBillData.category || "",
          amount: parseFloat(monthlyBillData.amount) || 0,
          startDate: now.toISOString(), // Use current time for startDate
          endDate: now.toISOString(), // Use current time for endDate
          duration: parseInt(monthlyBillData.duration) || 0,
        };

        console.log(
          "Sending bill data to /api/MonthlyBill/AddMonthlyBill:",
          billData
        );

        const response = await api.post("/MonthlyBill", billData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        console.log("Bill response status:", response.status);
        console.log("Bill response data:", response.data);

        if (response.status === 200) {
          // Success - clear form and show success message
          setMonthlyBillData({
            name: "",
            issuer: "",
            category: "",
            amount: "",
            duration: "",
          });
          setStartDateInput(""); // Clear date inputs
          setEndDateInput(""); // Clear date inputs
          setError(null); // Clear any previous errors
          setSuccess("Bill added successfully!");
        } else {
          throw new Error(
            response.data.message ||
              `Failed to save bill with status: ${response.status}`
          );
        }
      }
    } catch (error) {
      console.error("=== Detailed Error Information ===");
      console.error("1. Error Object:", error);
      console.error("2. Error Message:", error.message);
      console.error("3. Error Response:", error.response);
      console.error("4. Error Config:", error.config);
      console.error("5. Request Headers:", error.config?.headers);
      console.error("6. Request Data:", error.config?.data);

      if (error.response) {
        console.error("7. Response Status:", error.response.status);
        console.error("8. Response Headers:", error.response.headers);
        console.error("9. Response Data:", error.response.data);

        if (error.response.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else if (error.response.status === 500) {
          setError(
            "Server error occurred. Please try again or contact support."
          );
        } else if (error.response.data?.errors) {
          // Specific error handling for manual form (validation errors)
          const errorMessages = Object.values(
            error.response.data.errors
          ).flat();
          setError(errorMessages.join(", "));
        } else if (error.response.data) {
          setError(
            error.response.data.title ||
              error.response.data.message ||
              JSON.stringify(error.response.data)
          );
        } else {
          setError(
            `Error: ${error.response.status} - ${
              error.response.data?.message || "Server error occurred"
            }`
          );
        }
      } else if (error.request) {
        console.error("7. No Response Received");
        setError("No response received from server. Please try again.");
      } else {
        console.error("7. Request Setup Error");
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 p-4 md:p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Add Item Purchased
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveView("scanReceipt")}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
              activeView === "scanReceipt"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Scan Receipt
          </button>
          <button
            onClick={() => setActiveView("form")}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
              activeView === "form"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Manual Form
          </button>
          <button
            onClick={() => setActiveView("monthlyBill")}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
              activeView === "monthlyBill"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Add Monthly Bill
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-md">
            {success}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 mx-auto items-center lg:items-start lg:justify-center max-w-screen-lg">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-1/2">
            {activeView === "scanReceipt" && (
              // Image Upload Section
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                <label htmlFor="receiptImage" className="text-center">
                  <FiUploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-white mb-1">
                    {formData.receiptImage
                      ? formData.receiptImage.name
                      : "Drag & drop your receipt here, or click to browse"}
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    (Receipts must be in English)
                  </p>
                  <input
                    type="file"
                    id="receiptImage"
                    name="receiptImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {activeView === "form" && (
              // Manual Form Fields
              <>
                <div>
                  <label
                    htmlFor="itemName"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-400"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-400"
                    >
                      Price (L.E.)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Date
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md p-2 pl-10 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="shopName"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Shop Name
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}

            {activeView === "monthlyBill" && (
              // Monthly Bill Form Fields (Placeholder)
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Bill Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={monthlyBillData.name}
                    onChange={(e) =>
                      setMonthlyBillData({
                        ...monthlyBillData,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="issuer"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Issuer
                  </label>
                  <input
                    type="text"
                    id="issuer"
                    name="issuer"
                    value={monthlyBillData.issuer}
                    onChange={(e) =>
                      setMonthlyBillData({
                        ...monthlyBillData,
                        issuer: e.target.value,
                      })
                    }
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={monthlyBillData.category}
                    onChange={(e) =>
                      setMonthlyBillData({
                        ...monthlyBillData,
                        category: e.target.value,
                      })
                    }
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {monthlyBillCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={monthlyBillData.amount}
                    onChange={(e) =>
                      setMonthlyBillData({
                        ...monthlyBillData,
                        amount: e.target.value,
                      })
                    }
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-400"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDateInput}
                    onChange={(e) => setEndDateInput(e.target.value)}
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={monthlyBillData.duration}
                    onChange={(e) =>
                      setMonthlyBillData({
                        ...monthlyBillData,
                        duration: e.target.value,
                      })
                    }
                    className="mt-1 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                loading ||
                (activeView === "scanReceipt" && !formData.receiptImage) ||
                (activeView === "form" &&
                  (!formData.itemName ||
                    !formData.category ||
                    !formData.date ||
                    !formData.price ||
                    !formData.quantity ||
                    !formData.shopName)) ||
                (activeView === "monthlyBill" &&
                  (!monthlyBillData.name ||
                    !monthlyBillData.issuer ||
                    !monthlyBillData.category ||
                    !monthlyBillData.amount ||
                    !startDateInput ||
                    !endDateInput ||
                    !monthlyBillData.duration))
              }
            >
              {loading
                ? "Processing..."
                : activeView === "scanReceipt"
                ? "Scan Receipt"
                : activeView === "form"
                ? "Submit Purchase"
                : "Add Bill"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default History;
