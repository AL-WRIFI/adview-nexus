// We need to extend the existing types, so we can't use the // ... keep existing code notation
// Instead, we'll add the ApiResponse type and export it

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  email?: string;
  image?: string | null;
  state_id?: number;
  city_id?: number;
  address?: string | null;
  created_at?: string;
  is_verified?: boolean;
  // Add missing properties that are being used in components
  bio?: string;
  avatar?: string;
  city?: string;
  name?: string;
  verified?: boolean;
  createdAt?: string;
}

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  negotiable?: boolean;
  condition: 'new' | 'used';
  category: string;
  subcategory?: string;
  city: string;
  district?: string;
  images: string[];
  featured: boolean;
  views_count: number;
  comments_count: number;
  listing_type: 'sell' | 'buy' | 'exchange' | 'service';
  created_at: string;
  seller: {
    id: number;
    name: string;
    avatar?: string;
    verified: boolean;
    phone: string;
    createdAt: string;
  };
  // Additional fields for compatibility
  category_name?: string;
  city_name?: string;
  image?: string;
  viewCount?: number; // Alias for views_count
  status?: string;
}

export interface Listing {
  id: number;
  title: string;
  slug?: string;
  description: string;
  price: number;
  is_negotiable?: boolean;
  condition: 'new' | 'used';
  listing_type: 'sell' | 'buy' | 'exchange' | 'service';
  category_id: number;
  category_name: string;
  subcategory_id?: number;
  subcategory_name?: string;
  brand_id?: number;
  brand_name?: string;
  model?: string;
  city_id: number;
  city_name: string;
  state_id?: number;
  state_name?: string;
  district_id?: number;
  district_name?: string;
  image: string;
  images?: string[];
  featured?: boolean;
  views_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at?: string;
  user_id: number;
  user?: User;
  attributes?: Record<string, any>;
  // For compatibility with Ad type
  category?: string;
  city?: string;
  seller?: {
    id: number;
    name: string;
    avatar?: string;
    verified: boolean;
    phone: string;
    createdAt: string;
  };
  viewCount?: number; // Alias for views_count
  status?: string;
}

export interface ListingDetails extends Listing {
  comments?: Comment[];
  related?: Listing[];
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  listing_id: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: Comment[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  icon?: string;
  count?: number;
  subcategories?: Category[];
  children?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  count?: number;
  title?: string; 
}

// Update SearchFilters to include missing properties
export interface SearchFilters {
  search?: string;
  category_id?: number | number[];
  subcategory_id?: number | number[];
  child_category_id?: number | number[];
  brand_id?: number | number[];
  city_id?: number | number[];
  state_id?: number | number[];
  district_id?: number | number[];
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
  city?: string;
  sort_by?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  condition?: '' | 'new' | 'used';
  has_image?: boolean;
  has_delivery?: boolean;
  lat?: number;
  lng?: number;
  distance?: number;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  // Add missing property
  meta?: {
    last_page: number;
    current_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

// This will replace the Conversation type that's missing
export interface Conversation {
  id: number;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  conversationId: number;
  read: boolean;
  createdAt: string;
}
