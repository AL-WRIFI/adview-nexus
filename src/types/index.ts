
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
  icon?: string;
  subcategories?: SubCategory[];
}

export interface Brand {
  id: number;
  name: string;
  category_id?: number;
}

export interface State {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
}

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  subcategory?: string;
  condition?: string;
  image?: string | null | { image_url: string };
  images?: string[] | { url: string }[];
  user_id: number;
  user?: User;
  created_at: string;
  updated_at?: string;
  status: 'active' | 'inactive' | 'sold';
  featured?: boolean;
  promoted_until?: string;
  views?: number;
  views_count?: number;
  viewCount?: number;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  address?: string;
  neighborhood?: string;
  favorites_count?: number;
  is_favorited?: boolean;
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
  image?: string | null | { image_url: string };
  images?: string[] | { url: string }[];
  user_id: number;
  user?: User;
  created_at: string;
  updated_at?: string;
  status: 'active' | 'inactive' | 'sold';
  featured?: boolean;
  promoted_until?: string;
  views?: number;
  views_count?: number;
  viewCount?: number;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  address?: string;
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

export interface Conversation {
  id: number;
  user?: User;
  last_message?: string;
  created_at: string;
  updated_at?: string;
}

export interface SearchFilters {
  category?: string;
  category_id?: number;
  subcategory?: string;
  sub_category_id?: number;
  brand_id?: number;
  state_id?: number;
  city_id?: number;
  minPrice?: number;
  maxPrice?: number;
  price_min?: number;
  price_max?: number;
  location?: string;
  condition?: string;
  listing_type?: string;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high';
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
  query?: string;
  lat?: number;
  lon?: number;
  radius?: number;
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
