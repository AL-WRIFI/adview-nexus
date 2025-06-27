
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token?: string;
  };
  errors?: Record<string, string[]>;
}

export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  verified?: boolean;
  wallet_balance?: number;
  created_at?: string;
  updated_at?: string;
}
