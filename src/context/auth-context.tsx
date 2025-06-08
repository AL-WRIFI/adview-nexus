
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useCurrentUser, useLogin, useRegister, useLogout } from '@/hooks/use-api';

// TokenManager for token management
export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  
  static hasToken(): boolean {
    return !!localStorage.getItem(TokenManager.TOKEN_KEY);
  }
  
  static getToken(): string | null {
    return localStorage.getItem(TokenManager.TOKEN_KEY);
  }
  
  static setToken(token: string): void {
    localStorage.setItem(TokenManager.TOKEN_KEY, token);
  }
  
  static removeToken(): void {
    localStorage.removeItem(TokenManager.TOKEN_KEY);
  }
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, refetch } = useCurrentUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ identifier: email, password });
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await registerMutation.mutateAsync(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      TokenManager.removeToken();
      setIsAuthenticated(false);
    } catch (error) {
      // Even if logout fails, clear local state
      TokenManager.removeToken();
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    await refetch();
  };

  const value = {
    user: user || null,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
