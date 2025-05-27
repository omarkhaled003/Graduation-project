import { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

const ToBuy = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const stores = [
    {
      id: 1,
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    },
    {
      id: 2,
      name: "Walmart",
      logo: "https://cdn.worldvectorlogo.com/logos/walmart.svg",
    },
    {
      id: 3,
      name: "American Eagle",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/American-Eagle-Logo.png",
    },
    {
      id: 4,
      name: "eBay",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png",
    },
    {
      id: 5,
      name: "Carrefour",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Carrefour_logo.svg/2560px-Carrefour_logo.svg.png",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToShoppingList = (product) => {
    setShoppingList((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromShoppingList = (productId) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // First filter the products based on search
  const filteredProducts = products.filter((product) => {
    const searchTerm = searchQuery.toLowerCase().trim();
    const productTitle = (product.title || "").toLowerCase();
    return productTitle.includes(searchTerm);
  });

  // Then handle pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-white">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 relative flex flex-col flex-1 min-h-screen bg-[#121212] text-white">
      {/* <div className="p-6 space-y-6 relative min-h-screen"> */}
      {/* Search Section */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-[#2A2A2A] text-white rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Recommended Stores */}
      <div>
        <h2 className="text-gray-400 text-base mb-6">Recommended Stores</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="flex-shrink-0 bg-[#2A2A2A] rounded-xl p-6 w-32 h-32 flex items-center justify-center"
            >
              <img
                src={store.logo}
                alt={store.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-6">
        {currentProducts.map((product) => (
          <div key={product.id} className="bg-[#1E1E1E] rounded-xl p-6">
            <div className="flex gap-6">
              {/* Product Image */}
              <div className="w-40 h-40 bg-[#2A2A2A] rounded-lg flex items-center justify-center p-4">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white text-xl font-semibold">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-6 mt-2">
                      <p className="text-gray-400 text-base">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.discountPercentage > 0 && (
                        <p className="text-green-500 text-base">
                          {product.discountPercentage}% off
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addToShoppingList(product)}
                    className="bg-[#2A2A2A] p-3 rounded-lg hover:bg-[#3A3A3A] transition-colors"
                  >
                    <FiPlus className="text-blue-500 w-6 h-6" />
                  </button>
                </div>

                {/* Category and Brand */}
                <div className="flex gap-3 mt-3">
                  <span className="bg-[#2A2A2A] text-gray-400 text-base px-4 py-2 rounded-full">
                    {product.category}
                  </span>
                  <span className="bg-[#2A2A2A] text-gray-400 text-base px-4 py-2 rounded-full">
                    {product.brand}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center mt-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <AiFillStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-base ml-3">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? "bg-[#2A2A2A] text-gray-600 cursor-not-allowed"
                : "bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
            }`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`w-10 h-10 rounded-lg ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-[#2A2A2A] text-gray-600 cursor-not-allowed"
                : "bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
            }`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Shopping List Button */}
      {/* <button
        onClick={() => setShowList(!showList)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <FiShoppingBag className="w-6 h-6" />
        {shoppingList.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {shoppingList.length}
          </span>
        )}
      </button> */}

      {/* Shopping List Modal (Placeholder) */}
      {/* {showList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] rounded-lg p-6 w-96">
            <h2 className="text-white text-xl font-semibold mb-4">Shopping List</h2>
            {shoppingList.length === 0 ? (
              <p className="text-gray-400">Your shopping list is empty.</p>
            ) : (
              <ul className="space-y-4">
                {shoppingList.map((item) => (
                  <li key={item.id} className="flex justify-between items-center text-white">
                    <span>{item.title} x {item.quantity}</span>
                    <button onClick={() => removeFromShoppingList(item.id)} className="text-red-500 hover:text-red-400">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowList(false)} className="bg-[#2A2A2A] text-white px-4 py-2 rounded-lg hover:bg-[#3A3A3A]">
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ToBuy;
