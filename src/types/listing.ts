
export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  currency?: string;
  images: string[];
  main_image_url?: string;
  gallery_images?: string[];
  category_id: number;
  subcategory_id?: number;
  child_category_id?: number;
  brand_id?: number;
  condition: 'new' | 'used' | 'refurbished';
  listing_type: 'sell' | 'buy' | 'rent' | 'exchange';
  status: 'active' | 'sold' | 'expired' | 'draft';
  featured: boolean;
  negotiable: boolean;
  phone_hidden: boolean;
  views_count: number;
  address?: string;
  lat?: number;
  lng?: number;
  user_id: string;
  user?: User;
  created_at: string;
  updated_at: string;
  comments_enabled: boolean;
  
  // Additional properties that components expect
  city?: string;
  city_name?: string;
  location?: string;
  viewCount?: number; // Alias for views_count
  is_negotiable?: boolean; // Alias for negotiable
}

export interface ListingDetails extends Listing {
  seller: User;
  related_ads?: Listing[];
  comments?: Comment[];
}

export interface ListingImage {
  id: number;
  listing_id: number;
  image_url: string;
  is_primary: boolean;
  order: number;
}

// Legacy alias for backward compatibility
export type Ad = Listing;
