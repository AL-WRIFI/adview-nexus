
// ApiResponse type definition
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone: string;
  email?: string;
  image?: string | null;
  state_id?: number;
  city_id?: number;
  address?: string | null;
  created_at?: string;
  is_verified?: boolean;
  bio?: string;
  avatar?: string;
  city?: string;
  name?: string;
  verified?: boolean;
  createdAt?: string;
  nationalId?: string;
}

export interface Ad {
  id: number | string;
  title: string;
  description: string;
  price: number;
  negotiable?: boolean;
  condition: 'new' | 'used';
  category: string | number;
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
    id: number | string;
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
  adType?: string;
  commentCount?: number;
}

export interface Listing {
  id: number | string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  is_negotiable?: boolean;
  condition: 'new' | 'used';
  listing_type: 'sell' | 'buy' | 'exchange' | 'service';
  category_id: number | string;
  category_name: string;
  subcategory_id?: number | string;
  subcategory_name?: string;
  brand_id?: number | string;
  brand_name?: string;
  model?: string;
  city_id: number | string;
  city_name: string;
  state_id?: number | string;
  state_name?: string;
  district_id?: number | string;
  district_name?: string;
  image: string;
  images?: string[];
  featured?: boolean;
  views_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at?: string;
  user_id: number | string;
  user?: User;
  attributes?: Record<string, any>;
  // For compatibility with Ad type
  category?: string | number;
  city?: string;
  seller?: {
    id: number | string;
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
  id: number | string;
  content: string;
  user_id: number | string;
  listing_id: number | string;
  parent_id?: number | string;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: Comment[];
  text?: string; // Alternative field name for content
  adId?: number | string; // Alternative field name for listing_id
}

export interface Category {
  id: number | string;
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number | string;
  icon?: string;
  count?: number;
  subcategories?: Category[];
  // Add property for child categories
  children?: Category[];
  arabicName?: string; // For display in Arabic
}

export interface Brand {
  id: number | string;
  name: string;
  slug?: string;
  logo?: string;
  count?: number;
  title?: string; // For compatibility with API responses
}

export interface SearchFilters {
  page?: number;
  per_page?: number;
  category_id?: number | string | (number | string)[];
  subcategory_id?: number | string | (number | string)[];
  child_category_id?: number | string | (number | string)[];
  brand_id?: number | string | (number | string)[];
  city_id?: number | string | (number | string)[];
  state_id?: number | string | (number | string)[];
  district_id?: number | string | (number | string)[];
  price_min?: number;
  price_max?: number;
  condition?: 'new' | 'used' | '';
  listing_type?: 'sell' | 'buy' | 'exchange' | 'service' | '';
  featured?: boolean;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular';
  lat?: number;
  lon?: number;
  radius?: number; // in km
  query?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  // Add these additional properties for filters
  today?: boolean;
  verified?: boolean;
  has_image?: boolean;
  has_price?: boolean;
  has_phone?: boolean;
  negotiable?: boolean;
  [key: string]: any; // Allow for dynamic properties
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
  id: number | string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  adId?: string | number;
  adTitle?: string;
  adImage?: string;
  isActive?: boolean;
}

export interface Message {
  id: number | string;
  content?: string;
  senderId: string | number;
  receiverId?: string | number;
  conversationId: string | number;
  read: boolean;
  createdAt: string;
  text?: string; // Alternative field name for content
  adId?: number | string;
}
