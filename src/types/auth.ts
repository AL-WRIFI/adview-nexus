
export interface User {
  id: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}
