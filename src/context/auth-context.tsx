
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useCurrentUser, useLogin, useRegister, useLogout } from '@/hooks/use-api';

// TokenManager for token management
export class TokenManager {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly SESSION_TOKEN_KEY = 'sessionAuthToken';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.SESSION_TOKEN_KEY);
  }

  static setToken(token: string, remember: boolean = true): void {
    if (remember) {
      localStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.removeItem(this.SESSION_TOKEN_KEY);
    } else {
      sessionStorage.setItem(this.SESSION_TOKEN_KEY, token);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.SESSION_TOKEN_KEY);
  }

  static hasToken(): boolean {
    return !!this.getToken();
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
    const authData = await loginMutation.mutateAsync({ identifier: email, password });

    TokenManager.setToken(authData.token, true);
    // Optionally, you can refetch the user data after login
    await refetch();
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
