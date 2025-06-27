
export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  listing_type: 'sell' | 'rent' | 'wanted' | 'exchange' | 'service';
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
}

export interface ListingDetails extends Listing {
  images: string[];
  related_listings?: Listing[];
  user: User;
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
}

// Legacy Ad type for backward compatibility
export interface Ad extends Listing {}
