
export interface Category {
  id: number;
  name: string;
  parent_id?: number;
  icon?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: Category[];
  // Additional properties used in components
  image_url?: string;
  image?: string;
  slug?: string;
  count?: number;
  children?: Category[];
}
