    // src/context/ItemsContext.tsx
    import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
    import axios from "axios";
    import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Define the Item type
    interface Item {
    id: number;
    name: string;
    price: number;
    amount: number;
    category: string;
    }

    // Define context type
    interface ItemsContextType {
    items: Item[];
    loading: boolean;
    refreshItems: () => void;
    }

    // Create context
    const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

    // Provider component
    export function ItemsProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch all items from backend (only once)
    const fetchItems = async () => {
        try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/items`);
        setItems(response.data);
        toast.success("Loaded items successfully!")
        } catch (error) {
        toast.error("Failed to fetch items");
        console.error("Error fetching items:", error);
        } finally {
        setLoading(false);
        }
    };

    // Fetch items on component mount
    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <ItemsContext.Provider value={{ items, loading, refreshItems: fetchItems }}>
        {children}
        </ItemsContext.Provider>
    );
    }

    // Custom hook to use items context
    export function useItems() {
    const context = useContext(ItemsContext);
    if (context === undefined) {
        throw new Error("useItems must be used within an ItemsProvider");
    }
    return context;
    }