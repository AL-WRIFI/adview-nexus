
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
}

export interface Ad extends Listing {
  // Ad is an alias for Listing
}
