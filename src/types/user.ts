
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  image: string | null;
  state_id: number;
  city_id: number;
  address: string | null;
  email_verified: boolean;
  verified_status: number | null;
  is_suspend: number | null;
  // Additional properties for compatibility
  name?: string;
  avatar?: string;
  bio?: string;
  city?: string;
  wallet_balance?: number;
  verified?: boolean;
}
