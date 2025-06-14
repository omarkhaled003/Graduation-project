import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi"; // Importing icons
import api from "../utils/api"; // Import the shared API instance

const UserInfo = ({ user }) => {
  // Crucial null check: If user is null, don't render any hooks or JSX
  // This must be the very first executable line to follow Rules of Hooks
  if (!user) {
    return null;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null); // New state for photo URL
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // New state for image modal
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clear user data as well
    navigate("/login"); // Redirect to login page
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
    setDropdownOpen(false);
  };

  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch profile photo
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (user && user.token) {
        try {
          const response = await api.get("/User/GetPhoto", {
            responseType: "blob",
          });
          if (response.data && response.data.size > 0) {
            const imageUrl = URL.createObjectURL(response.data);
            setProfilePhotoUrl(imageUrl);
          } else {
            setProfilePhotoUrl(null);
          }
        } catch (error) {
          setProfilePhotoUrl(null);
        }
      } else {
        setProfilePhotoUrl(null);
      }
    };

    fetchProfilePhoto();

    return () => {
      if (profilePhotoUrl) {
        URL.revokeObjectURL(profilePhotoUrl);
      }
    };
  }, [user]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors focus:outline-none"
      >
        <div
          onClick={toggleImageModal}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold overflow-hidden cursor-pointer"
        >
          {profilePhotoUrl ? (
            <img
              src={profilePhotoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : user?.email ? (
            user.email.charAt(0).toUpperCase()
          ) : (
            "U"
          )}
        </div>
        <span className="hidden sm:inline">{user?.email || "User"}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-md shadow-lg py-1 z-50">
          <button
            onClick={handleEditProfile}
            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white w-full text-left"
          >
            <FiUser className="mr-2" /> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-700 hover:text-white w-full text-left"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]"
          onClick={toggleImageModal}
        >
          <div
            className="relative p-4 max-w-full max-h-full bg-gray-800 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleImageModal}
              className="absolute top-2 right-2 text-white text-3xl font-bold p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              &times;
            </button>
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt="Profile Large"
                className="max-w-full max-h-[80vh] object-contain"
              />
            ) : (
              <div className="flex items-center justify-center text-white text-9xl">
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
