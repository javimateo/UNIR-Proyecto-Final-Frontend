import { IUser } from './iuser.interface';

export interface IItem {
  id?: number;
  user_id?: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  item_condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  status?: 'draft' | 'published' | 'under_review' | 'removed' | 'sold';
  location?: string;
  latitude?: number;
  longitude?: number;
  created_at?: Date;
  updated_at?: Date;
  // Campos auxiliares y relaciones
  photos?: string[];
  user?: Partial<IUser>;
  category_name?: string;
}
