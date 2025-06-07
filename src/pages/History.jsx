import React, { useState } from "react";
import { FiCalendar, FiChevronDown, FiUploadCloud } from "react-icons/fi";

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
  const [bestPriceData, setBestPriceData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      receiptImage: e.target.files[0],
    }));
  };

  const handleLaptopClick = async (listId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://ecofi-fheaf6arh9acd6ck.germanywestcentral-01.azurewebsites.net/api/BestPriceProduct/GetBestPriceProduct/${listId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch best price data: ${response.status}`);
      }

      const data = await response.json();
      setBestPriceData(data);

      // Update form with the best price data
      setFormData((prev) => ({
        ...prev,
        itemName: data.productName || prev.itemName,
        price: data.price || prev.price,
        shopName: data.shopName || prev.shopName,
        category: data.category || prev.category,
      }));
    } catch (err) {
      console.error("Error fetching best price:", err);
      setError(err.message || "Failed to fetch best price data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First, send the receipt image if it exists
      if (formData.receiptImage) {
        const receiptFormData = new FormData();
        receiptFormData.append("receiptImage", formData.receiptImage);

        console.log("Sending receipt image...");
        const receiptResponse = await fetch(
          "https://ecofi-fheaf6arh9acd6ck.germanywestcentral-01.azurewebsites.net/api/PurchasedProduct/AddReceipt",
          {
            method: "POST",
            body: receiptFormData,
          }
        );

        console.log("Receipt response status:", receiptResponse.status);
        const receiptData = await receiptResponse.json();
        console.log("Receipt response data:", receiptData);

        if (!receiptResponse.ok) {
          throw new Error(
            receiptData.message || "Failed to upload receipt image"
          );
        }
      }

      // Then, send the purchase data
      const purchaseData = {
        id: 0,
        productName: formData.itemName,
        category: formData.category,
        date: formData.date || new Date().toISOString().split("T")[0],
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity) || 0,
        shopName: formData.shopName,
      };

      console.log("Sending purchase data:", purchaseData);

      const purchaseResponse = await fetch(
        "https://ecofi-fheaf6arh9acd6ck.germanywestcentral-01.azurewebsites.net/api/PurchasedProduct/AddPurchasedProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(purchaseData),
        }
      );

      console.log("Purchase response status:", purchaseResponse.status);
      const purchaseResponseData = await purchaseResponse.json();
      console.log("Purchase response data:", purchaseResponseData);

      if (purchaseResponse.ok) {
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
        setError("");
        // You might want to show a success message or redirect
      } else {
        throw new Error(
          purchaseResponseData.message ||
            `Failed to save purchase with status: ${purchaseResponse.status}`
        );
      }
    } catch (err) {
      console.error("Error saving data:", err);
      setError(err.message || "Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 p-4 md:p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Add item Purchased
        </h2>

        {/* Best Price Data Display */}
        {bestPriceData && (
          <div className="bg-[#1E1E1E] p-4 rounded-md mb-6">
            <h3 className="text-lg font-semibold mb-2">Best Price Found</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">
                  Product: {bestPriceData.productName}
                </p>
                <p className="text-gray-400">Price: ${bestPriceData.price}</p>
              </div>
              <div>
                <p className="text-gray-400">Shop: {bestPriceData.shopName}</p>
                <p className="text-gray-400">
                  Category: {bestPriceData.category}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 mx-auto items-center lg:items-start lg:justify-center max-w-screen-lg">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-1/2">
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
                <option value="Food & Drink">Food & Drink</option>
                <option value="Shopping">Shopping</option>
                <option value="Transportation">Transportation</option>
                <option value="Others">Others</option>
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
                  min="1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-400"
                >
                  Price
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

            <div>
              <label
                htmlFor="receiptImage"
                className="block text-sm font-medium text-gray-400"
              >
                Receipt Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-[#2A2A2A] rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="receiptImage"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {formData.receiptImage && (
                    <p className="text-sm text-gray-400">
                      Selected: {formData.receiptImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Purchase"}
            </button>
          </form>

          {/* Best Price List Section (Laptop List) */}
          <div className="w-full lg:w-1/2 bg-[#1E1E1E] rounded-xl p-4 md:p-6">
            <h2 className="text-white text-xl font-semibold mb-4">
              Best Prices Found
            </h2>
            <div className="space-y-4">
              {/* Example List Item */}
              <div
                className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg cursor-pointer"
                onClick={() => handleLaptopClick(123)} // Replace 123 with actual listId
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Laptop"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">Gaming Laptop</p>
                    <p className="text-gray-400 text-sm">$1200 - Amazon</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">$1200.00</p>
                  <p className="text-gray-400 text-sm">Best Price</p>
                </div>
              </div>
              {/* More items... */}
              <div
                className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg cursor-pointer"
                onClick={() => handleLaptopClick(456)} // Replace 456 with actual listId
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Monitor"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">4K Monitor</p>
                    <p className="text-gray-400 text-sm">$350 - Best Buy</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">$350.00</p>
                  <p className="text-gray-400 text-sm">Best Price</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => console.log("View all best prices")}
              className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Best Prices
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
