
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  image_url?: string;
  icon?: string;
  parent_id?: number;
  order?: number;
  is_active?: boolean;
  count?: number;
  subcategories?: Category[];
  children?: Category[];
  created_at?: string;
  updated_at?: string;
}

export interface SubCategory extends Category {
  parent_id: number;
}
