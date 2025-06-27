
export interface Favorite {
  id: number;
  user_id: string;
  listing_id: number;
  created_at: string;
  listing?: Listing;
}

import { Listing } from './listing';
