
export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  category_id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  images?: ListingImage[];
  location?: string;
  condition?: string;
  // Additional properties used in components
  image?: string | { image_url: string; url: string };
  featured?: boolean;
  city?: string;
  city_name?: string;
  views_count?: number;
  viewCount?: number;
  negotiable?: boolean;
  is_negotiable?: boolean;
  main_image_url?: string;
}

export interface ListingImage {
  id: number;
  listing_id: number;
  image_url: string;
  is_primary: boolean;
  url?: string;
}

export interface ListingDetails extends Listing {
  user: {
    id: number;
    name: string;
    avatar?: string;
    phone?: string;
  };
  category: {
    id: number;
    name: string;
  };
  // Additional properties used in AdDetails component
  related?: Listing[];
  comments?: any[];
  category_name?: string;
  sub_category_name?: string;
  address?: string;
  state?: string;
  listing_type?: string;
}

export interface Ad extends Listing {
  // Ad is an alias for Listing
  // Additional properties for backward compatibility
  category?: string;
  subcategory?: string;
  district?: string;
  comments_count?: number;
}
