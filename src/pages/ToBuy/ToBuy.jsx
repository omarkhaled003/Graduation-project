import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import api from "../../utils/api"; // Import the shared API instance

const ToBuy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [shoppingListLoading, setShoppingListLoading] = useState(false);
  const productsPerPage = 5;

  const [allProducts, setAllProducts] = useState([]); // Stores all products fetched from API
  const [displayedProducts, setDisplayedProducts] = useState([]); // Products currently displayed after search/filter
  const [aiSuggestedProductName, setAiSuggestedProductName] = useState(""); // Store only the product name
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Success message after purchase
  const [aiSuggestedProductNames, setAiSuggestedProductNames] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("Fetching all products from API.");
      const response = await api.get("/ToBuyList/GetToBuyList");

      console.log("API Response data:", response.data);

      let fetchedProducts = [];
      // Check if response.data is an array
      if (!Array.isArray(response.data)) {
        console.log(
          "Response data is not an array, attempting to process as single/empty item."
        );
        // If it's a single item, wrap it in an array
        fetchedProducts = response.data ? [response.data] : [];
      } else {
        console.log("Response data is an array.");
        // If it's already an array, use it directly
        fetchedProducts = response.data;
      }

      const formattedProducts = fetchedProducts.map((item) => ({
        id: item.id,
        title: item.productName,
        price: 0,
        thumbnail:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8z'/%3E%3C/svg%3E",
        category: "Shopping List",
        brand: "Personal",
        rating: 5,
        discountPercentage: 0,
      }));

      setAllProducts(formattedProducts); // Store all products
      setProducts(formattedProducts); // Initial products for display
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      let errorMessage = "Failed to fetch products. ";
      if (err.code === "ECONNABORTED") {
        errorMessage += "Request timed out. Please try again.";
      } else if (err.code === "ERR_NETWORK") {
        errorMessage += "Network error. Please check your connection.";
      } else {
        errorMessage += err.response?.data?.message || err.message;
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 on search query change
    const filtered = allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedProducts(filtered);
  }, [searchQuery, allProducts]);

  const fetchShoppingList = async () => {
    try {
      setShoppingListLoading(true);
      const response = await api.get("/ToBuyList/GetToBuyList");
      setShoppingList(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
      let errorMessage = "Failed to fetch shopping list. ";
      if (error.code === "ERR_NETWORK") {
        errorMessage += "Please check your internet connection.";
      } else {
        errorMessage += error.response?.data?.message || error.message;
      }
      setError(errorMessage);
    } finally {
      setShoppingListLoading(false);
    }
  };

  // On mount, load all AI suggestion product names from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("aiSuggestedProductNames");
    if (stored) {
      setAiSuggestedProductNames(JSON.parse(stored));
    }
  }, []);

  // Update fetchAiSuggestions to save all suggestions
  const fetchAiSuggestions = async () => {
    try {
      const response = await api.get("/ToBuyList/aisuggestion");
      let data = response.data;
      let productName = "";
      if (Array.isArray(data) && data.length > 0) {
        productName =
          data[0].suggestedProduct ||
          data[0].productName ||
          data[0].title ||
          "";
      } else if (
        data &&
        (data.suggestedProduct || data.productName || data.title)
      ) {
        productName = data.suggestedProduct || data.productName || data.title;
      }
      setAiSuggestedProductName(productName);
      // Save all suggestions to localStorage
      if (productName) {
        let allSuggestions = JSON.parse(
          localStorage.getItem("aiSuggestedProductNames") || "[]"
        );
        if (!allSuggestions.includes(productName)) {
          allSuggestions.push(productName);
          localStorage.setItem(
            "aiSuggestedProductNames",
            JSON.stringify(allSuggestions)
          );
          setAiSuggestedProductNames(allSuggestions);
        }
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      setAiSuggestedProductName("");
    }
  };

  const addToShoppingList = async (product) => {
    try {
      setLoading(true);
      console.log("Adding product to shopping list:", product);

      await api.post("/ToBuyList/AddToBuyList", {
        productName: product.productName,
      });

      setLoading(false);
      fetchProducts(); // Refetch all products to update the list
      setError(null);
    } catch (err) {
      console.error("Error adding to shopping list:", err);
      let errorMessage = "Failed to add product to shopping list. ";
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

  const removeProduct = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/ToBuyList/DeleteFromToBuyList`, { params: { id } });
      fetchProducts(); // Refetch all products to update the list
      fetchShoppingList(); // Also refetch shopping list to update
      setError(null);
    } catch (err) {
      console.error("Error removing product:", err);
      let errorMessage = "Failed to remove product. ";
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

  const clearShoppingList = async () => {
    try {
      setLoading(true);
      await api.delete("/ToBuyList/ClearToBuyList");
      fetchProducts(); // Refetch all products to update the list
      fetchShoppingList(); // Also refetch shopping list to update
      setError(null);
    } catch (err) {
      console.error("Error clearing shopping list:", err);
      let errorMessage = "Failed to clear shopping list. ";
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

  const buySelectedProducts = async () => {
    try {
      setLoading(true);
      await api.post("/ToBuyList/BuySelectedProducts", shoppingList);
      setShoppingList([]); // Clear local shopping list after buying
      await fetchProducts(); // Ensure products are refreshed
      await fetchAiSuggestions(); // Ensure AI suggestions are refreshed
      setCurrentPage(1); // Reset to first page for best UX
      setError(null);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Hide after 3 seconds
    } catch (err) {
      console.error("Error buying selected products:", err);
      let errorMessage = "Failed to buy selected products. ";
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

  // Combine products and AI suggestions for display (must be before pagination logic)
  const combinedProducts = [...products];

  // Filter combined products by search query
  const filteredCombinedProducts = combinedProducts.filter((product) =>
    (product.title || product.productName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination logic should use filteredCombinedProducts
  const totalPages = Math.ceil(
    filteredCombinedProducts.length / productsPerPage
  );
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredCombinedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("fetchAi") === "1") {
      fetchAiSuggestions();
      // Remove the param so it doesn't fetch again on future visits
      params.delete("fetchAi");
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <div className="p-4 md:p-8 space-y-6 min-h-screen bg-[#121212] text-white">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[1000]">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
          <p className="ml-4 text-white text-xl">Loading products...</p>
        </div>
      )}
      {/* Main Content */}
      <div className="w-full max-w-full px-0 sm:px-4 md:px-8 overflow-x-hidden">
        {/* Responsive header and search/add item row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 w-full">
          <h1 className="text-white text-3xl font-bold">To Buy List</h1>
          <div className="flex space-x-4">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#1E1E1E] text-white rounded-lg pr-10 sm:pl-10 pl-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    // handleSearch();
                  }
                }}
              />
              {/* Icon on right for mobile, left for sm+; slightly lower on mobile */}
              <div className="absolute top-3 right-3 sm:inset-y-0 sm:left-3 sm:right-auto sm:flex sm:items-center">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  fetchProducts();
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => setShowList(!showList)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiPlus /> Add Item
            </button>
          </div>
        </div>

        {/* Add Item Form / Shopping List */}
        {showList && (
          <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
            <h2 className="text-white text-xl font-semibold mb-4">
              Add New Item to Shopping List
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Pass only the product name to the addToShoppingList function
                // Assuming backend generates the ID upon addition
                addToShoppingList({
                  productName: searchQuery || "",
                });
                setSearchQuery(""); // Clear the search query after adding
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="productName"
                  className="text-gray-400 block mb-2"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  className="bg-[#2A2A2A] text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add to List
              </button>
            </form>
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Purchase completed successfully!</span>
            </div>
          </div>
        )}

        {/* Product list card styled as a Reports card */}
        <div className="bg-[#18181b] rounded-xl p-4 mb-4 w-full max-w-full">
          <h2 className="text-white text-lg font-semibold mb-4">
            Your Products
          </h2>
          {loading ? (
            <p className="text-gray-400">Loading products...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filteredCombinedProducts.length === 0 ? (
            <p className="text-gray-400">No products in your list.</p>
          ) : (
            <div className="space-y-4 w-full">
              {currentProducts.map((product, idx) => {
                // Check if this product is in the AI suggestions array
                const isSuggested =
                  aiSuggestedProductNames.includes(product.title) ||
                  aiSuggestedProductNames.includes(product.productName);
                let productName =
                  product.title ||
                  product.productName ||
                  product.suggestedProduct ||
                  "Suggestion";
                return (
                  <div
                    key={product.id || `ai-${idx}`}
                    className="flex items-center justify-between gap-2 p-3 bg-[#18181b] border border-[#232323] rounded-2xl shadow-sm mb-3"
                  >
                    {/* Product Image */}
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                      style={{
                        background: isSuggested
                          ? "linear-gradient(135deg, #FFD700 60%, #FFFACD 100%)"
                          : "#444",
                      }}
                    >
                      {isSuggested ? (
                        // Gold AI icon SVG
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="#FFD700"
                        >
                          <circle cx="12" cy="12" r="10" fill="#FFD700" />
                          <text
                            x="12"
                            y="16"
                            textAnchor="middle"
                            fontSize="10"
                            fill="#333"
                            fontWeight="bold"
                          >
                            AI
                          </text>
                        </svg>
                      ) : (
                        <img
                          src={
                            product.thumbnail ||
                            product.image ||
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8z'/%3E%3C/svg%3E"
                          }
                          alt={productName}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                    </div>
                    {/* Product Info */}
                    <div className="flex-1 min-w-0 ml-2 flex items-center gap-2">
                      <div className="font-bold text-white text-sm truncate">
                        {productName}
                        {isSuggested && (
                          <span className="ml-2 text-blue-400 font-semibold text-xs">
                            (suggestion)
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 ml-2">
                      <button
                        onClick={() =>
                          navigate(`/best-price/${product.id || idx}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-3 py-1 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-3 py-1 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination (if present) */}
        <div className="flex justify-center mt-4 w-full overflow-x-auto">
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A] disabled:opacity-50"
              >
                <FiChevronLeft />
              </button>
              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded-lg ${
                    pageNumber === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A] disabled:opacity-50"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToBuy;
