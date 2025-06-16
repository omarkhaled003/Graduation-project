import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiAlertCircle, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Notifications = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 600000, // 10 minutes timeout
  });

  // Add request interceptor to add token to all requests
  api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", user);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log("Authorization header set:", config.headers.Authorization);
    } else {
      console.warn("No user token found in localStorage");
    }
    return config;
  });

  useEffect(() => {
    const fetchAlerts = async () => {
      console.log("Starting to fetch alerts...");
      try {
        setLoading(true);
        console.log("Making API request to /Alert...");
        const response = await api.get("/Alert");
        console.log("Raw API Response:", response);
        console.log("Alerts API Response Data:", response.data);
        console.log("Number of alerts received:", response.data.length);

        // Log each alert's structure
        response.data.forEach((alert, index) => {
          console.log(`Alert ${index + 1} structure:`, {
            id: alert.id,
            title: alert.title,
            message: alert.message,
            dateCreated: alert.dateCreated,
            productId: alert.productId,
          });
        });

        setAlerts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        console.error("Error details:", {
          message: err.message,
          code: err.code,
          response: err.response,
          request: err.request,
        });

        let errorMessage = "Failed to fetch alerts. ";
        if (err.code === "ECONNABORTED") {
          errorMessage += "Request timed out.";
        } else if (err.code === "ERR_NETWORK") {
          errorMessage += "Network error.";
        } else {
          errorMessage += err.response?.data?.message || err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
        console.log("Fetch alerts operation completed. Loading state:", false);
      }
    };

    fetchAlerts();
  }, []);

  // Log state changes
  useEffect(() => {
    console.log("Alerts state updated:", alerts);
  }, [alerts]);

  useEffect(() => {
    console.log("Loading state changed:", loading);
  }, [loading]);

  useEffect(() => {
    console.log("Error state changed:", error);
  }, [error]);

  if (loading) {
    console.log("Rendering loading state");
    return (
      <div className="p-4 md:p-6 bg-[#121212] min-h-screen text-white">
        <div className="text-center py-8">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    console.log("Rendering error state:", error);
    return (
      <div className="p-4 md:p-6 bg-[#121212] min-h-screen text-white">
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    );
  }

  console.log("Rendering main view with alerts:", alerts);
  return (
    <div className="p-4 md:p-6 bg-[#121212] min-h-screen text-white">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No notifications available
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            console.log("Rendering alert:", alert);
            const alertDate = new Date(alert.date);
            const isValidDate = !isNaN(alertDate.getTime());

            const displayDate = isValidDate
              ? `${alertDate.toLocaleDateString()} ${alertDate.toLocaleTimeString()}`
              : "Date Unavailable";

            let iconComponent = <FiInfo className="text-blue-400 text-2xl" />;
            let borderColorClass = "border-blue-500"; // Default info color

            // Assuming 'type' field in alert object indicates the type of alert
            if (alert.type === 100) {
              // Example: spending limit alert
              iconComponent = (
                <FiAlertCircle className="text-red-500 text-2xl" />
              );
              borderColorClass = "border-red-500";
            }

            return (
              <div
                key={alert.id}
                className={`flex items-start bg-[#1E1E1E] rounded-xl p-4 shadow-md hover:bg-[#2A2A2A] transition-colors border-l-4 ${borderColorClass}`}
              >
                <div className="flex-shrink-0 mr-4 mt-1">{iconComponent}</div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">
                        {alert.title}
                      </h3>
                      <p className="text-gray-300 text-sm">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-4">
                      {displayDate}
                    </span>
                  </div>
                  {alert.productId && (
                    <button
                      onClick={() => {
                        console.log("Navigating to product:", alert.productId);
                        navigate(`/product-details/${alert.productId}`);
                      }}
                      className="mt-3 text-blue-400 hover:text-blue-300 text-sm inline-flex items-center"
                    >
                      View Product Details
                      <FiArrowLeft className="ml-1 rotate-180" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
