import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ItemsProvider } from "./context/ItemsContext";
import { CartProvider } from './context/CartContext';



ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <AuthProvider>
        <ItemsProvider>
          <CartProvider>  
            <App />
          </CartProvider>
        </ItemsProvider>
      </AuthProvider>
    </BrowserRouter>
);