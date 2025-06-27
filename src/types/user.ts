
export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  verified?: boolean;
  wallet_balance?: number;
  created_at?: string;
  updated_at?: string;
}
