import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import cartIcon from "../assets/grocery-cart.png";

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            SuperMarket
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center shadow-sm hover:shadow-md"
                  aria-label="Shopping Cart"
                >
                  <img 
                    src={cartIcon} 
                    alt="Cart" 
                    className="w-6 h-6" 
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;