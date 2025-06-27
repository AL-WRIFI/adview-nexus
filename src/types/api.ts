
import { User } from './user';
import { Listing } from './listing';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  // Support for direct pagination properties
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number;
  to?: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface Conversation {
  id: number;
  listing_id?: number;
  buyer_id?: string;
  seller_id?: string;
  last_message_at?: string;
  created_at?: string;
  listing?: Listing;
  buyer?: User;
  seller?: User;
  messages?: Message[];
  unread_count?: number;
}

export interface Message {
  id: number;
  conversation_id?: number;
  sender_id?: string;
  content: string;
  message_type?: string;
  read_at?: string;
  created_at?: string;
  sender?: User;
}

export interface Favorite {
  id: number;
  user_id?: string;
  listing_id?: number;
  created_at?: string;
  listing?: Listing;
}
