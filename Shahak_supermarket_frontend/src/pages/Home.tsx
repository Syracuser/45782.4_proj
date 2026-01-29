// src/pages/Home.tsx
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemsContext";
import { useCart } from "../context/CartContext";

function Home() {
  const { user } = useAuth();
  const { items, loading } = useItems();
  const { addToCart } = useCart();
  
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Available categories
  const categories = ["All", "Fruits", "Bakery", "Dairy"];

  // Filter items by category (client-side filtering)
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") {
      return items;
    }
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  // Handle add to cart
  const handleAddToCart = (item: any) => {
    addToCart(item.id, item.name);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      {/* Category Filter Dropdown */}
      <div className="mb-6">
        <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : (
        <>
          {/* Product Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  {/* Product Image Placeholder */}
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">🛒</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>

                  {/* Category Badge */}
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                    {item.category}
                  </span>

                  {/* Price and Stock */}
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-bold text-green-600">
                      ${item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stock: {item.amount}
                    </p>
                  </div>

                  {/* Add to Cart Button - Only show if user is logged in */}
                  {user && (
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No products found in this category.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Home;