
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  name?: string;
  email: string;
  phone?: string;
  image?: string;
  avatar?: string;
  wallet_balance?: number;
  verified?: boolean;
  created_at?: string;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  subcategories?: SubCategory[];
  color?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  category_id: number;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  subcategory?: string;
  condition?: string;
  image?: string | null;
  images?: string[];
  user_id: number;
  user?: User;
  created_at: string;
  updated_at?: string;
  status: 'active' | 'inactive' | 'sold';
  featured?: boolean;
  promoted_until?: string;
  views?: number;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  neighborhood?: string;
  favorites_count?: number;
  is_favorited?: boolean;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  user?: User;
  user_id?: number;
  listing_id?: number;
  parent_id?: number;
  replies?: Comment[];
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  condition?: string;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high';
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string;
  prev_page_url?: string;
  from?: number;
  to?: number;
}

export interface Favorite {
  id: number;
  user_id: number;
  listing_id: number;
  created_at: string;
  listing: Listing;
}
