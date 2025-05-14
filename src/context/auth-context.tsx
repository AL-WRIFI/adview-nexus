
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { api, setToken, clearToken } from "@/services/api";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  checkAuthStatus: () => Promise<boolean>;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const getUserFromLocalStorage = (): User | null => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        return null;
      }
    }
    return null;
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      const storedToken = localStorage.getItem('token');
      const storedUser = getUserFromLocalStorage();
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        try {
          // Verify token is still valid with a lightweight API call
          await api.get('/user/me');
        } catch (error) {
          console.error('Token validation error:', error);
          // If token is invalid, clear credentials
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken('');
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      
      // Save to localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error?.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
      setError(errorMessage);
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      
      // Save to localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Register error:', error);
      
      const errorMessage = error?.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب';
      setError(errorMessage);
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API if available
      try {
        await api.post('/auth/logout');
      } catch (err) {
        // Ignore errors on logout API
        console.log('Error calling logout API, proceeding anyway:', err);
      }
      
      // Clear tokens and user data
      clearToken();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };
  
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      if (!localStorage.getItem('token')) {
        return false;
      }
      
      const response = await api.get('/user/me');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
