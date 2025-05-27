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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen bg-[#121212] text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add item Purchased
      </h2>

      <div className="flex flex-col lg:flex-row gap-12 mx-auto items-center lg:items-start lg:justify-center max-w-screen-lg">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-1/2">
          <div>
            <label
              htmlFor="itemName"
              className="block text-sm font-medium text-gray-400"
            >
              *Item Name
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            <div className="relative mt-1">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block appearance-none w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-md shadow-sm py-2 px-3 pr-8 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {/* Add category options here */}
                <option value="food">Food</option>
                <option value="clothes">Clothes</option>
                <option value="electronics">Electronics</option>
                <option value="others">Others</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <FiChevronDown className="h-5 w-5" />
              </div>
            </div>
          </div>

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
              min="1"
              className="mt-1 block w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-400"
            >
              *Price
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="block w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-md shadow-sm py-2 px-3 pr-10 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                step="0.01"
              />
              {/* Calendar icon - keeping as placeholder for now, assuming it's not a date picker */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <FiCalendar className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-400"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
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
              className="mt-1 block w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>

        {/* Separator */}
        <div className="flex items-center justify-center lg:flex-col h-full">
          <div className="w-px h-full bg-[#2A2A2A] lg:w-full lg:h-px" />
          <div className="px-4 text-gray-400">OR</div>
          <div className="w-px h-full bg-[#2A2A2A] lg:w-full lg:h-px" />
        </div>

        {/* Upload Section */}
        <div className="space-y-4 flex flex-col lg:items-center w-full lg:w-1/2">
          <h3 className="text-xl font-semibold text-gray-400">
            Upload Recite Photo
          </h3>
          <label
            htmlFor="receiptImage"
            className="flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-[#2A2A2A] border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors"
          >
            <FiUploadCloud className="w-12 h-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-400">Upload an Image</p>
            <input
              id="receiptImage"
              name="receiptImage"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
          {formData.receiptImage && (
            <p className="text-sm text-gray-400">
              File selected: {formData.receiptImage.name}
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          form="itemForm"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#121212]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default History;
