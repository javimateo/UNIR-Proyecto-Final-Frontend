import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IItem } from '../interface/iitem.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/items';
  private getHeaders(): HttpHeaders {
    // Aquí recuperamos el token del lugar donde lo guardes al hacer login
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  
 async getAll(filters?: { 
  search?: string; 
  category_id?: number; 
  item_condition?: string; 
  min_price?: number; 
  max_price?: number; 
  page?: number; 
  per_page?: number; 
}): Promise<{ results: IItem[]; total: number; page: number; total_pages: number }> {

  let params = new HttpParams();

  // Si existen filtros, los añadimos
  if (filters) {
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      // Solo añadimos si el valor no es nulo/indefinido (y manejamos el 0 si aplica)
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
  }

  const data = await lastValueFrom(
    this.httpClient.get<any>(this.baseUrl, { params })
  );

  // Manejo de respuesta (por si viene directo el array o el objeto paginado)
  if (Array.isArray(data)) {
    return { results: data, total: data.length, page: 1, total_pages: 1 };
  }

  return data;
}

  async getAllItems(url: string): Promise<IItem[]> {
    const miUrl = (url==="") ? this.baseUrl : url;
    return await lastValueFrom(
      this.httpClient.get<IItem[]>(miUrl)
    );
  }

 
  async getById(id: number): Promise<IItem> {
    return await lastValueFrom(
      this.httpClient.get<IItem>(`${this.baseUrl}/${id}`)
    );
  }

  
  async create(item: IItem): Promise<IItem> {
    return await lastValueFrom(
      this.httpClient.post<IItem>(this.baseUrl, item, { headers: this.getHeaders() })
    );
  }

  async update(id: number, itemData: Partial<IItem>): Promise<IItem> {
    return await lastValueFrom(
      this.httpClient.put<IItem>(`${this.baseUrl}/${id}`, itemData, { headers: this.getHeaders() })
    );
  }

  
  async getCategories(): Promise<{ id: number; name: string }[]> {
    return await lastValueFrom(
      this.httpClient.get<{ id: number; name: string }[]>('http://localhost:3000/api/categories')
    );
  }
  searchItems(keywords: string) {
  // Cambiamos 'apiUrl' por 'baseUrl' para que coincida con el resto de tus métodos
  return this.httpClient.get<any>(`${this.baseUrl}/items?search=${keywords}`);
}
}
  

