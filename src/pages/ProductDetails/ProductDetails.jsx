import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceHistoryData, setPriceHistoryData] = useState([]);

  const api = axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 60000, // Increased timeout
  });

  // Add request interceptor to add token to all requests
  api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(
          `/BestPriceProduct/GetBestPriceProductsDetails/${id}`
        );
        console.log("Product Details API Response:", response.data);
        setProductDetails(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product details:", err);
        let errorMessage = "Failed to fetch product details. ";
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
      }
    };

    const fetchPriceHistory = async () => {
      if (!id) return;
      try {
        const response = await api.get(
          `/BestPriceProduct/GetProductPriceHistory${id}`
        );
        console.log("Price History API Response:", response.data);
        setPriceHistoryData(response.data);
      } catch (err) {
        console.error("Error fetching price history:", err);
        // Handle error, e.g., set an error state for price history
      }
    };

    fetchProductDetails();
    fetchPriceHistory();
  }, [id]);

  if (loading) {
    return <div className="text-white">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#121212] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Product Details for ID: {id}</h1>
      {productDetails ? (
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6 shadow-md flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0">
            {productDetails.image && (
              <img
                src={productDetails.image}
                alt={productDetails.productName}
                className="w-full max-w-xs h-auto object-contain rounded-lg mb-4 bg-white p-2"
              />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-semibold mb-2">
              {productDetails.productName || "Product Name N/A"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400">Category:</p>
                <p className="text-lg font-bold">
                  {productDetails.category || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Price:</p>
                <p className="text-lg font-bold text-blue-400">
                  L.E. {productDetails.price?.toFixed(2) || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Store:</p>
                <p className="text-lg font-bold">
                  {productDetails.shopName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Date Recorded:</p>
                <p className="text-lg font-bold">
                  {productDetails.date
                    ? new Date(productDetails.date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              {productDetails.url && (
                <div className="sm:col-span-2 lg:col-span-1">
                  <p className="text-gray-400">Product URL:</p>
                  <a
                    href={productDetails.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-lg font-bold truncate block"
                  >
                    View Product
                  </a>
                </div>
              )}
              {productDetails.priceHistory &&
                productDetails.priceHistory.length > 0 && (
                  <div>
                    <p className="text-gray-400">Price History:</p>
                    <p className="text-lg font-bold">
                      Available ({productDetails.priceHistory.length} entries)
                    </p>
                  </div>
                )}
            </div>

            {/* Price History Graph Section */}
            {priceHistoryData && priceHistoryData.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Price History</h3>
                <div className="bg-[#2A2A2A] p-4 rounded-lg">
                  <Line
                    data={{
                      labels: priceHistoryData.map((item) =>
                        new Date(item.dateRecorded).toLocaleDateString()
                      ),
                      datasets: [
                        {
                          label: "Price",
                          data: priceHistoryData.map((item) => item.price),
                          fill: false,
                          borderColor: "rgb(75, 192, 192)",
                          tension: 0.1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                          labels: { color: "#E0E0E0" },
                        },
                        title: {
                          display: true,
                          text: "Product Price History",
                          color: "#E0E0E0",
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              let label = context.dataset.label || "";
                              if (label) {
                                label += ": ";
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "EGP",
                                }).format(context.parsed.y);
                              }
                              return label;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: { color: "#E0E0E0" },
                          grid: { color: "#444" },
                        },
                        y: {
                          ticks: { color: "#E0E0E0" },
                          grid: { color: "#444" },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>No product details found.</p>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default ProductDetails;
