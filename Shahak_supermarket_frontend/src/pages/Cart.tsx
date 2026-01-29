import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading } = useCart();

  const handleIncrease = (cartItemId: number, currentQuantity: number) => {
    updateQuantity(cartItemId, currentQuantity + 1);
  };

  const handleDecrease = (cartItemId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(cartItemId, currentQuantity - 1);
    }
  };

  const handleCheckout = () => {
    clearCart(() => {
      navigate('/checkout-success');
    });
  };

  // Calculate total
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Simply don't render if not logged in - let your routing/auth handle redirects
  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 text-xl mb-4">Please log in to view your cart</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 text-xl">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-xl mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Cart Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-lg mb-2">{item.item_name}</h3>
                <p className="text-green-600 font-bold mb-4">${item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleDecrease(item.id, item.quantity)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item.id, item.quantity)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary - Centered */}
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Cart Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-semibold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between mb-4 text-xl">
              <span className="font-bold">Total Price:</span>
              <span className="font-bold text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;