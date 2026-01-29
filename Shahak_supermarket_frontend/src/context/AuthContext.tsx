import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
    user_id: number;
    exp: number;
    };

    type AuthContextType = {
    token: string | null;
    user: DecodedToken | null;
    login: (token: string) => void;
    logout: () => void;
    };

    const AuthContext = createContext<AuthContextType | null>(null);

    export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<DecodedToken | null>(null);

    // load token on refresh / reopen
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        try {
        const decoded = jwtDecode<DecodedToken>(storedToken);

        // check expiration
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return;
        }

        setToken(storedToken);
        setUser(decoded);
        } catch {
        localStorage.removeItem("token");
        }
    }, []);

    const login = (newToken: string) => {
        const decoded = jwtDecode<DecodedToken>(newToken);

        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
    }

    export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
    }
