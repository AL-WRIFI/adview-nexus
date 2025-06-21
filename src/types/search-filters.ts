
export interface SearchFilters {
  query?: string;
  category_id?: number;
  subcategory_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  condition?: string;
  location?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}
