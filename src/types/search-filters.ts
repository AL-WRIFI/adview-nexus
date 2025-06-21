
export interface SearchFilters {
  query?: string;
  category_id?: number;
  subcategory_id?: number;
  sub_category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  condition?: string;
  location?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
  // Additional properties used in components
  city_id?: number;
  state_id?: number;
  district_id?: number;
  product_condition?: string;
  listing_type?: string;
  sort?: string;
  search?: string;
  lat?: number;
  lon?: number;
  radius?: number;
  featured?: boolean;
  verified_user?: boolean;
  with_images?: boolean;
}
