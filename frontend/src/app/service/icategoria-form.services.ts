import { inject, Injectable, input, signal } from '@angular/core';
import { ICategoriaForm } from '../interface/icategoria-form.interface';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interface/iuser.interface';

@Injectable({
  providedIn: 'root',
})
export class ICategoriaFormServices {
  arrayCategorias = signal<ICategoriaForm>;
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  async getAllPromises(): Promise<ICategoriaForm[]> {
    try {
      return await lastValueFrom(
        this.httpClient.get<ICategoriaForm[]>(`${this.baseUrl}/categories`),
      );
    } catch (error) {
      throw error;
    }
  }

  async create(nuevaCategoria: ICategoriaForm): Promise<ICategoriaForm> {
    try {
      const token = localStorage.getItem('token');

      const headers = { Authorization: `Bearer ${token}` };

      return await lastValueFrom(
        this.httpClient.post<ICategoriaForm>(`${this.baseUrl}/categories`, nuevaCategoria, {
          headers,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, categoriaEditada: ICategoriaForm): Promise<ICategoriaForm> {
    try {
      const token = localStorage.getItem('token');

      const headers = { Authorization: `Bearer ${token}` };

      return await lastValueFrom(
        this.httpClient.put<ICategoriaForm>(`${this.baseUrl}/categories/${id}`, categoriaEditada, {
          headers,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<ICategoriaForm> {
    try {
      
      return await lastValueFrom(
        this.httpClient.delete<ICategoriaForm>(`${this.baseUrl}/categories/${id}`),
      );
    } catch (error) {
      throw error;
    }
  }
}
