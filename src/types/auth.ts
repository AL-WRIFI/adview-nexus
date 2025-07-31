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
  confirm_password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
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
