export interface IUser {
  id: number;          
  username: string;
  apellido: string;
  email: string;
  password: string;
  status: string
  role?: string;        
  avatar_url: string;
}

export interface IUserEditForm{
  username: string,
  apellido: string,
  email:string,
  role: string
}

export interface IUserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: IUser[];
}

export interface IStatsUsers {
  active: number;
  blocked: number;
  deleted: number;
  total: number;
}

export interface IStatsItems {
  published: number;
  draft: number;
  under_review: number;
  sold: number;
  removed: number;
  total: number;
}

export interface IStatsReports {
  pending: number;
  resolved_active: number;
  resolved_removed: number;
  total: number;
}

export interface IStatsRecent {
  published_last_30d: number;
}


export interface IGlobalStatsPayload {
  users: IStatsUsers;
  items: IStatsItems;
  reports: IStatsReports;
  recent: IStatsRecent;
}