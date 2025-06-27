
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
    email_verification_required?: boolean;
    email_sent?: boolean;
    token_expires_in_minutes?: number;
    remaining_attempts?: number;
  };
  errors?: any;
}

import { User } from './user';
