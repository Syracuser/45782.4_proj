import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface CartItem {
  id: number;
  item_id: number;
  item_name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (itemId: number, itemName: string) => void;
  removeFromCart: (cartItemId: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  clearCart: (onSuccess?: () => void) => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, token]);

  const fetchCart = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId: number, itemName: string) => {
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/cart`,
        {
          item_id: itemId,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh cart from backend
      await fetchCart();
      toast.success(`${itemName} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/cart/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update local state immediately
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!token) return;

    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      await axios.put(
        `${API_URL}/cart/${cartItemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state immediately
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async (onSuccess?: () => void) => {
    if (!token) return;

    try {
      await axios.post(`${API_URL}/checkout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCartItems([]);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Checkout failed');
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};