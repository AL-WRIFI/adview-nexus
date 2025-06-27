
import { User } from './user';

export interface Comment {
  id: number;
  listing_id: number;
  user_id: string;
  parent_id?: number | null;
  content: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  user?: User;
  replies?: Comment[];
  can_edit?: boolean;
  can_delete?: boolean;
}
