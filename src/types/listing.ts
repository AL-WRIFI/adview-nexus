
import { User } from './user';
import { Category } from './category';
import { Brand } from './brand';

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  listing_type: 'sell' | 'rent' | 'wanted' | 'exchange' | 'service' | 'buy';
  condition?: 'new' | 'used' | 'refurbished';
  status?: 'active' | 'inactive' | 'sold' | 'expired';
  address?: string;
  main_image_url?: string;
  gallery_images?: string[] | GalleryImage[];
  images?: string[];
  image?: string | { image_url: string; url: string } | null;
  user_id?: string;
  category_id?: number;
  subcategory_id?: number;
  child_category_id?: number;
  brand_id?: number;
  negotiable?: boolean;
  is_negotiable?: boolean;
  phone_hidden?: boolean;
  featured?: boolean;
  views_count?: number;
  viewCount?: number;
  lat?: number;
  lng?: number;
  lon?: number;
  comments_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  user?: User;
  category?: Category;
  subcategory?: Category;
  brand?: Brand;
  city?: string;
  city_name?: string;
  location?: string;
  category_name?: string;
  sub_category_name?: string;
  state?: string;
  state_id?: number;
  city_id?: number;
}

export interface ListingDetails extends Listing {
  images: string[];
  related_listings?: Listing[];
  related?: Listing[];
  comments?: Comment[];
  user: User;
  category_name?: string;
  sub_category_name?: string;
  state?: string;
  state_id?: number;
  city_id?: number;
  lon?: number;
}

export interface GalleryImage {
  id?: number;
  url: string;
  alt?: string;
  order?: number;
}

export interface ListingImage {
  id: number;
  url: string;
  alt?: string;
  order: number;
  image_url?: string;
}

export interface MainImage {
  image_id: number;
  url: string;
  image_url?: string;
}

// Legacy Ad type for backward compatibility
export interface Ad extends Listing {}

// Import Comment here to avoid circular dependency
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
