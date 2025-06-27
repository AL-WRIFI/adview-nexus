
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  path?: string;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  links?: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export interface Conversation {
  id: number;
  listing_id: number;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
  listing?: Listing;
  buyer?: User;
  seller?: User;
  messages?: Message[];
  unread_count?: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  read_at?: string | null;
  created_at: string;
  sender?: User;
}
