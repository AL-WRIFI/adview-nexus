
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
}
