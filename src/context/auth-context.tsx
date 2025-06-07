
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useCurrentUser, useLogin, useLogout, useRegister } from '@/hooks/use-api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use API hooks
  const { data: currentUserData, isLoading: isLoadingUser, error: userError } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  // Update user state when API data changes
  useEffect(() => {
    if (currentUserData?.data) {
      setUser(currentUserData.data);
    } else if (userError) {
      setUser(null);
      // Clear token if user fetch fails
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
    setIsLoading(isLoadingUser);
  }, [currentUserData, userError, isLoadingUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await registerMutation.mutateAsync(userData);
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
