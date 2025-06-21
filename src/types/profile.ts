
export interface Profile {
  id: number;
  user_id: number;
  bio?: string;
  avatar?: string;
  cover_image?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface Comment {
  id: number;
  listing_id: number;
  user_id: number;
  content: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
    image?: string;
    first_name?: string;
    last_name?: string;
  };
  replies?: Comment[];
}

export interface Conversation {
  id: number;
  participants: User[];
  last_message?: Message;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  sender: User;
}

// Import User from the user types
import { User } from './user';
