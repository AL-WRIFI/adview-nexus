
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useCurrentUser } from '@/hooks/use-api';

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

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (email: string, password: string) => {
    // Mock login implementation - replace with actual API call
    console.log('Login attempt:', email);
    throw new Error('Login not implemented yet');
  };

  const register = async (userData: any) => {
    // Mock register implementation - replace with actual API call
    console.log('Register attempt:', userData);
    throw new Error('Register not implemented yet');
  };

  const logout = async () => {
    TokenManager.removeToken();
    setIsAuthenticated(false);
    // Redirect or other logout logic
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
