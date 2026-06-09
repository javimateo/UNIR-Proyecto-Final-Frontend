export interface IUser {
  id: number;          
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  role?: string;        
  createdAt?: Date;
}

export interface IUserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: IUser[];
}