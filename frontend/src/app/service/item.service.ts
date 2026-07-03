import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { IItem } from '../interface/iitem.interface';
import { lastValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private httpClient = inject(HttpClient);

  private get baseUrl(): string {
    return this.isProduction()
      ? 'https://unir-proyecto-final-backend-production.up.railway.app/api/items'
      : 'http://localhost:3000/api/items';
  }

  private isProduction(): boolean {
    return !isDevMode() && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  }

  // Datos simulados (mock) para asegurar que el frontend funcione de inmediato
  private mockItems: IItem[] = [
    {
      id: 1,
      user_id: 1,
      category_id: 1,
      title: 'iPhone 13 Pro - 128GB',
      description: 'Vendo iPhone 13 Pro en color azul sierra. Muy cuidado, siempre con funda y cristal templado. Salud de batería al 87%. Incluye caja original y cable de carga.',
      price: 580,
      item_condition: 'like_new',
      status: 'published',
      location: 'Madrid',
      latitude: 40.416775,
      longitude: -3.703790,
      created_at: new Date('2026-06-15T10:00:00Z'),
      category_name: 'Electrónica',
      photos: [
        'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60'
      ],
      user: { id: 1, username: 'Ana', email: 'ana@example.com' }
    },
    {
      id: 2,
      user_id: 2,
      category_id: 4,
      title: 'Bicicleta de montaña Rockrider',
      description: 'Bicicleta de montaña Rockrider en perfecto estado. Suspensión delantera, 24 velocidades, frenos de disco mecánicos. Ruedas de 27.5 pulgadas. Vendo por falta de uso.',
      price: 240,
      item_condition: 'good',
      status: 'published',
      location: 'Barcelona',
      latitude: 41.385064,
      longitude: 2.173403,
      created_at: new Date('2026-06-17T14:30:00Z'),
      category_name: 'Deportes',
      photos: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format&fit=crop&q=60'
      ],
      user: { id: 2, username: 'Carlos', email: 'carlos@example.com' }
    },
    {
      id: 3,
      user_id: 1,
      category_id: 2,
      title: 'Chaqueta de cuero vintage',
      description: 'Chaqueta de cuero auténtico negra, estilo vintage. Talla M. En muy buen estado, sin roturas ni marcas de desgaste. Muy abrigada.',
      price: 85,
      item_condition: 'good',
      status: 'published',
      location: 'Valencia',
      latitude: 39.469907,
      longitude: -0.376288,
      created_at: new Date('2026-06-18T09:15:00Z'),
      category_name: 'Ropa y moda',
      photos: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60'
      ],
      user: { id: 1, username: 'Ana', email: 'ana@example.com' }
    },
    {
      id: 4,
      user_id: 3,
      category_id: 3,
      title: 'Cafetera Express automática',
      description: 'Cafetera italiana express de 15 bares de presión. Permite preparar café molido o monodosis. Depósito de agua extraíble de 1.2L. Vaporizador para espumar leche.',
      price: 45,
      item_condition: 'fair',
      status: 'published',
      location: 'Sevilla',
      latitude: 37.389092,
      longitude: -5.984459,
      created_at: new Date('2026-06-10T18:45:00Z'),
      category_name: 'Hogar',
      photos: [
        'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60'
      ],
      user: { id: 3, username: 'David', email: 'david@example.com' }
    },
    {
      id: 5,
      user_id: 2,
      category_id: 5,
      title: 'Colección Harry Potter (Libros 1-7)',
      description: 'Saga completa de Harry Potter en tapa blanda. Editorial Salamandra. Leídos una sola vez, en perfecto estado. Se vende el pack completo.',
      price: 50,
      item_condition: 'like_new',
      status: 'published',
      location: 'Zaragoza',
      latitude: 41.648823,
      longitude: -0.889085,
      created_at: new Date('2026-06-19T11:20:00Z'),
      category_name: 'Libros',
      photos: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60'
      ],
      user: { id: 2, username: 'Carlos', email: 'carlos@example.com' }
    }
  ];

  // Obtener todos los anuncios con filtros locales como respaldo
  async getAll(filters?: {
    search?: string;
    category_id?: number;
    item_condition?: string;
    min_price?: number;
    max_price?: number;
    page?: number;
    per_page?: number;
  }): Promise<{ results: IItem[]; total: number; page: number; total_pages: number }> {
    try {
      // Intentar llamar a la API real
      const queryParams = [];
      if (filters) {
        if (filters.search) queryParams.push(`search=${encodeURIComponent(filters.search)}`);
        if (filters.category_id) queryParams.push(`category_id=${filters.category_id}`);
        if (filters.item_condition) queryParams.push(`item_condition=${filters.item_condition}`);
        if (filters.min_price) queryParams.push(`min_price=${filters.min_price}`);
        if (filters.max_price) queryParams.push(`max_price=${filters.max_price}`);
        if (filters.page) queryParams.push(`page=${filters.page}`);
        if (filters.per_page) queryParams.push(`per_page=${filters.per_page}`);
      }
      const url = `${this.baseUrl}${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`;
      const data = await lastValueFrom(
        this.httpClient.get<any>(url).pipe(timeout(8000))
      );
      if (Array.isArray(data)) {
        return { results: data, total: data.length, page: 1, total_pages: 1 };
      }
      return data;
    } catch (error) {
      if (this.isProduction()) {
        throw error;
      }
      
      // Lógica de filtrado local para desarrollo offline/simulado
      let filtered = [...this.mockItems];

      if (filters) {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(searchLower) || 
            item.description.toLowerCase().includes(searchLower)
          );
        }
        if (filters.category_id && +filters.category_id !== 0) {
          filtered = filtered.filter(item => item.category_id === +filters.category_id!);
        }
        if (filters.item_condition) {
          filtered = filtered.filter(item => item.item_condition === filters.item_condition);
        }
        if (filters.min_price !== undefined && filters.min_price !== null) {
          filtered = filtered.filter(item => item.price >= filters.min_price!);
        }
        if (filters.max_price !== undefined && filters.max_price !== null) {
          filtered = filtered.filter(item => item.price <= filters.max_price!);
        }
      }

      // Paginación local
      const page = filters?.page || 1;
      const perPage = filters?.per_page || 4;
      const total = filtered.length;
      const totalPages = Math.ceil(total / perPage);
      const startIdx = (page - 1) * perPage;
      const paginatedResults = filtered.slice(startIdx, startIdx + perPage);

      return {
        results: paginatedResults,
        total,
        page,
        total_pages: totalPages
      };
    }
  }

  // Obtener anuncio por ID
  async getById(id: number): Promise<IItem> {
    try {
      return await lastValueFrom(
        this.httpClient.get<IItem>(`${this.baseUrl}/${id}`).pipe(timeout(8000))
      );
    } catch (error) {
      if (this.isProduction()) {
        throw error;
      }
      const item = this.mockItems.find(i => i.id === +id);
      if (!item) {
        throw new Error('Anuncio no encontrado');
      }
      return item;
    }
  }

  // Crear nuevo anuncio
  async create(item: IItem): Promise<IItem> {
    try {
      return await lastValueFrom(
        this.httpClient.post<IItem>(this.baseUrl, item).pipe(timeout(8000))
      );
    } catch (error) {
      if (this.isProduction()) {
        throw error;
      }
      const newId = this.mockItems.length > 0 ? Math.max(...this.mockItems.map(i => i.id || 0)) + 1 : 1;
      const newItem: IItem = {
        ...item,
        id: newId,
        created_at: new Date(),
        status: 'published',
        user: { id: 1, username: 'Jonathan', email: 'jonathan@example.com' },
        category_name: this.getCategoryNameById(item.category_id)
      };
      this.mockItems.unshift(newItem); // Añadir al inicio
      return newItem;
    }
  }

  // Actualizar anuncio
  async update(id: number, itemData: Partial<IItem>): Promise<IItem> {
    try {
      return await lastValueFrom(
        this.httpClient.put<IItem>(`${this.baseUrl}/${id}`, itemData).pipe(timeout(8000))
      );
    } catch (error) {
      if (this.isProduction()) {
        throw error;
      }
      const index = this.mockItems.findIndex(i => i.id === +id);
      if (index === -1) {
        throw new Error('Anuncio no encontrado');
      }
      
      const updatedItem = {
        ...this.mockItems[index],
        ...itemData,
        category_name: itemData.category_id ? this.getCategoryNameById(itemData.category_id) : this.mockItems[index].category_name,
        updated_at: new Date()
      };
      
      this.mockItems[index] = updatedItem;
      return updatedItem;
    }
  }

  // Auxiliar para categorías
  private getCategoryNameById(categoryId: number): string {
    const categories: Record<number, string> = {
      1: 'Electrónica',
      2: 'Ropa y moda',
      3: 'Hogar',
      4: 'Deportes',
      5: 'Libros',
      6: 'Juguetes',
      7: 'Vehículos',
      8: 'Otros'
    };
    return categories[categoryId] || 'Otros';
  }
}
