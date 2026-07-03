import { IUser } from './iuser.interface';

export interface IItem {
  id: number;
  user_id?: number;
  category_id?: number;
  title: string;
  description: string;
  price: number;
  specs: string
  item_condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  status: 'draft' | 'published' | 'under_review' | 'removed' | 'sold';
  location?: string;
  latitude?: number;
  longitude?: number;
  created_at?: Date;
  updated_at?: Date;
  cover_photo?: string;
  user?: Partial<IUser>;
  category_name?: string;
}

export interface IItemFilters {
  search?: string;
  category_id?: number;
  item_condition?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
}

export interface IPagination {
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}
