import React, { useState } from "react";
import { FiCamera, FiUser, FiDollarSign, FiFlag } from "react-icons/fi";
import axios from "axios";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    salary: "",
    savingGoal: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // For demonstration, we'll just log the data.
    // In a real application, you would send this to your backend API.
    console.log("Submitting profile data:", formData);

    try {
      // Here you would make an API call to update the user profile
      // Example (replace with your actual endpoint and data structure):
      // const response = await axios.put('/api/user/profile', formData);
      // console.log('Profile updated successfully:', response.data);

      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">
        Edit Your Account
      </h2>

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

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        {/* Image Upload */}
        <div>
          <label
            htmlFor="profileImage"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            <div className="flex items-center space-x-2 bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 cursor-pointer hover:bg-[#3A3A3A] transition-colors">
              <FiCamera className="w-5 h-5" />
              <span>
                {formData.image ? formData.image.name : "Choose an Image"}
              </span>
            </div>
          </label>
          <input
            type="file"
            id="profileImage"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="pl-10 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Salary Input */}
        <div>
          <label htmlFor="salary" className="sr-only">
            Salary
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="Salary"
              className="pl-10 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Saving Goal Input */}
        <div>
          <label htmlFor="savingGoal" className="sr-only">
            Saving Goal
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFlag className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="savingGoal"
              name="savingGoal"
              value={formData.savingGoal}
              onChange={handleInputChange}
              placeholder="saving goal"
              className="pl-10 block w-full bg-[#2A2A2A] text-white border-gray-700 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
