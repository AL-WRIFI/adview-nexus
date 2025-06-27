
export interface Category {
  id: number;
  name: string;
  name_ar?: string;
  slug?: string;
  description?: string;
  image?: string;
  image_url?: string;
  icon?: string;
  parent_id?: number | null;
  level?: number;
  sort_order?: number;
  status?: number;
  count?: number;
  subcategories?: Category[];
  children?: Category[];
  created_at?: string;
  updated_at?: string;
}
