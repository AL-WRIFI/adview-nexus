
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  image: string | null;
  avatar_url?: string;
  avatar?: string;
  name?: string; // Computed field from first_name + last_name
  bio?: string;
  state_id: number;
  city_id: number;
  address: string | null;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  email_verified: boolean;
  verified_status: number | null;
  verified?: boolean;
  is_suspend: number | null;
  wallet_balance?: number;
  created_at?: string;
  updated_at?: string;
  city?: string; // For backward compatibility
}
