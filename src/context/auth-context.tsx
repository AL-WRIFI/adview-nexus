
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

// Export tokenStorage for use in other files
export const tokenStorage = {
  getToken: () => localStorage.getItem("auth_token"),
  setToken: (token: string) => localStorage.setItem("auth_token", token),
  clearToken: () => localStorage.removeItem("auth_token"),
};

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  loading: false,
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock user data for development
  const mockUserData: User = {
    id: 1,
    name: "محمد أحمد",
    email: "user@example.com",
    avatar: "https://ui-avatars.com/api/?name=محمد+أحمد&background=random",
    phone: "966500000000",
    bio: "مرحباً بكم في ملفي الشخصي",
    created_at: "2023-01-01",
    updated_at: "2023-06-15",
    listings_count: 10,
    followers_count: 25,
    following_count: 15,
    location: "الرياض",
    verified: true
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const token = tokenStorage.getToken();
    if (token) {
      setUser(mockUserData); // In production, would verify token and fetch user data
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In production, would call API
      // const { data } = await api.post("/auth/login", { email, password });
      // tokenStorage.setToken(data.token);
      
      // Mock successful login
      await new Promise(resolve => setTimeout(resolve, 500));
      tokenStorage.setToken("mock-jwt-token");
      setUser(mockUserData);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("فشل تسجيل الدخول. تحقق من بريدك الإلكتروني وكلمة المرور.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      // In production, would call API
      // const response = await api.post("/auth/register", data);
      // tokenStorage.setToken(response.data.token);
      
      // Mock successful registration
      await new Promise(resolve => setTimeout(resolve, 500));
      tokenStorage.setToken("mock-jwt-token");
      setUser(mockUserData);
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("فشل التسجيل. يرجى التحقق من البيانات والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    tokenStorage.clearToken();
    setUser(null);
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      // In production, would call API to get latest user data
      // const { data } = await api.get("/auth/me");
      // setUser(data);
      
      // Mock refreshing user data
      await new Promise(resolve => setTimeout(resolve, 300));
      setUser({
        ...mockUserData,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        loading,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
