import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
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

const BestPrice = () => {
  const { listid } = useParams();
  const navigate = useNavigate();
  const [bestPriceData, setBestPriceData] = useState(null);
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
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  });

  useEffect(() => {
    const fetchBestPrice = async () => {
      if (!listid) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(
          `/BestPriceProduct/GetBestPriceProduct/${listid}`
        );

        console.log("Best Price API Response:", response.data);

        const productsWithHistory = await Promise.all(
          response.data.map(async (product) => {
            try {
              const historyResponse = await api.get(
                `/BestPriceProduct/GetProductPriceHistory/${product.id}`
              );
              return { ...product, priceHistory: historyResponse.data };
            } catch (historyErr) {
              console.error(
                `Error fetching price history for product ${product.id}:`,
                historyErr
              );
              return { ...product, priceHistory: [] }; // Return empty array on error
            }
          })
        );

        setBestPriceData(productsWithHistory);
        setError(null);
      } catch (err) {
        console.error("Error fetching best price:", err);
        let errorMessage = "Failed to fetch best price. ";
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

    fetchBestPrice();
  }, [listid]);

  if (loading) {
    return <div className="text-white">Loading best price...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#121212] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">
        Best Prices for Product ID: {listid}
      </h1>
      {bestPriceData && bestPriceData.length > 0 ? (
        <div className="space-y-6">
          {bestPriceData.map((product) => (
            <div
              key={product.id}
              className="bg-[#1E1E1E] rounded-xl p-4 md:p-6 shadow-md flex flex-col sm:flex-row gap-6"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full sm:w-1/3 h-48 object-contain rounded-lg bg-white p-2"
                />
              )}
              <div className="flex-1 space-y-3">
                <h2 className="text-2xl font-semibold">
                  {product.productName}
                </h2>
                <p className="text-gray-400">
                  {product.description || "No description available."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Price:</p>
                    <p className="text-xl font-bold text-blue-400">
                      L.E. {product.price?.toFixed(2) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Store:</p>
                    <p className="text-xl font-bold">
                      {product.shopName || "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/product-details/${product.id}`)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Details
                </button>

                {/* Price History Graph Section */}
                {product.priceHistory && product.priceHistory.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">
                      Price History
                    </h3>
                    <div className="bg-[#2A2A2A] p-4 rounded-lg">
                      <Line
                        data={{
                          labels: product.priceHistory.map((item) =>
                            new Date(item.dateRecorded).toLocaleDateString()
                          ),
                          datasets: [
                            {
                              label: "Price",
                              data: product.priceHistory.map(
                                (item) => item.price
                              ),
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
                              text: `Price History for ${product.productName}`,
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
                                      currency: "EGP", // Changed from "USD" to "EGP"
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
          ))}
        </div>
      ) : (
        <p>No best price found for this product.</p>
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

export default BestPrice;
