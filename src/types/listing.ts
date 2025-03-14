
export interface Listing {
  id: number;
  user_id: number;
  admin_id?: number;
  category_id: number;
  sub_category_id?: number;
  child_category_id?: number;
  brand_id?: number;
  country_id: number;
  state_id: number;
  city_id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  gallery_images?: string; // Assume JSON string of image paths
  video_url?: string;
  price: number;
  negotiable: boolean;
  condition: string;
  contact_name: string;
  email: string;
  phone: string;
  phone_hidden: boolean;
  address: string;
  lon?: string; // longitude
  lat?: string; // latitude
  is_featured: boolean;
  view: number;
  status: string;
  is_published: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  
  // Related data (to be populated if needed)
  user?: any;
  category?: Category;
  subcategory?: Category;
  childCategory?: Category;
  brand?: Brand;
  location?: Location;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
}

export interface Location {
  country: string;
  state: string;
  city: string;
  full_address: string;
}

// For demo data
export const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
