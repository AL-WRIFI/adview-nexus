
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
}

export interface ListingImage {
  id: number;
  listing_id: number;
  image_url: string;
  is_primary: boolean;
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
