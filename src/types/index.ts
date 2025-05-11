
// Basic API types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  last_page?: number;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface SearchFilters {
  category_id?: number | string;
  subcategory_id?: number | string;
  location_id?: number | string;
  min_price?: number | string;
  max_price?: number | string;
  keyword?: string;
  featured?: boolean | string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular" | string;
  has_image?: boolean;
  has_price?: boolean;
  has_phone?: boolean;
  negotiable?: boolean;
  verified?: boolean;
  today?: boolean;
  [key: string]: any; // Allow additional properties for future extensibility
}

// Category Types
export interface Category {
  id: number | string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  banner?: string;
  parent_id?: number | string | null;
  children?: Category[];
}

export interface Location {
  id: number | string;
  name: string;
  parent_id?: number | string | null;
  children?: Location[];
}

// User Types
export interface User {
  id: number | string;
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone: string;
  avatar?: string;
  verified: boolean;
  createdAt: string;
  location?: string;
  about?: string;
  roles?: string[];
}

// Listing/Ad Types
export interface Listing {
  id: number | string;
  title: string;
  slug: string;
  description: string;
  price?: number;
  price_formatted?: string;
  negotiable?: boolean;
  status: 'active' | 'pending' | 'sold' | 'expired' | 'rejected';
  featured: boolean;
  views: number;
  favorites: number;
  created_at: string;
  updated_at: string;
  images: string[];
  thumbnail?: string;
  category: {
    id: number | string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: number | string;
    name: string;
    slug: string;
  };
  location: {
    id: number | string;
    name: string;
    parent_name?: string;
  };
  user: {
    id: number | string;
    name: string;
    avatar?: string;
    verified: boolean;
    phone: string;
    createdAt: string;
  };
  attributes?: Array<{
    id: number | string;
    name: string;
    value: string;
  }>;
  has_phone?: boolean;
  has_image?: boolean;
  has_price?: boolean;
}

// Notification Types
export interface Notification {
  id: number | string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  data?: any;
}

// Message Types
export interface Message {
  id: number | string;
  conversation_id: number | string;
  sender_id: number | string;
  receiver_id: number | string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number | string;
  ad_id: number | string;
  ad_title: string;
  ad_image?: string;
  last_message: string;
  unread_count: number;
  updated_at: string;
  user: {
    id: number | string;
    name: string;
    avatar?: string;
  };
}
