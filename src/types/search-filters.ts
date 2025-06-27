
export interface SearchFilters {
  category_id?: number;
  subcategory_id?: number;
  sub_category_id?: number; // Legacy support
  child_category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  listing_type?: 'sell' | 'rent' | 'wanted' | 'exchange' | 'service' | 'buy';
  condition?: 'new' | 'used' | 'refurbished';
  product_condition?: 'new' | 'used' | 'refurbished'; // Legacy support
  city_id?: number;
  state_id?: number;
  lat?: number;
  lng?: number;
  lon?: number; // Legacy support
  radius?: number;
  search?: string;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'created_at' | 'updated_at';
  sort_by?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular' | 'created_at' | 'updated_at'; // Legacy support
  featured?: boolean;
  negotiable?: boolean;
  page?: number;
  per_page?: number;
}
