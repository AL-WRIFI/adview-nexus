
export interface Comment {
  id: number | string;
  content: string;
  rating?: number;
  user_id?: string;
  listing_id?: number;
  parent_id?: number | string;
  created_at?: string;
  updated_at?: string;
  user?: User;
  replies?: Comment[];
}

export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  avatar?: string;
  image?: string;
  name?: string;
  verified?: boolean;
}
