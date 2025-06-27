
export interface SearchFilters {
  search?: string;
  category_id?: number;
  subcategory_id?: number;
  sub_category_id?: number; // Alias for backward compatibility
  child_category_id?: number;
  brand_id?: number;
  city_id?: number;
  state_id?: number;
  min_price?: number;
  max_price?: number;
  condition?: 'new' | 'used' | 'refurbished' | string;
  product_condition?: 'new' | 'used' | 'refurbished' | string; // Alias
  listing_type?: 'sell' | 'buy' | 'rent' | 'exchange' | string;
  featured?: boolean;
  negotiable?: boolean;
  sort?: string;
  sort_by?: string; // Alias for sort
  lat?: number;
  lon?: number;
  lng?: number; // Alias for lon
  radius?: number;
  page?: number;
  per_page?: number;
  limit?: number;
}
