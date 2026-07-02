import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IGlobalStatsPayload, IUser, IUserEditForm, IUserListResponse } from '../interface/iuser.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IUserServices {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';
  cacheEstadisticas: IGlobalStatsPayload | null = null;
  getAllPromises(): Promise<IUser[]> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return lastValueFrom(this.httpClient.get<IUser[]>(`${this.baseUrl}/users`, { headers }));
  }
  
  create(formValue: IUser): Promise<IUser> {
    const userToSave: Partial<IUser> = {
      username: formValue.username,
      apellido: formValue.apellido,
      email: formValue.email,
      password: formValue.password
    };
    return lastValueFrom(this.httpClient.post<IUser>(`${this.baseUrl}/auth/register`, userToSave));
  }

  getById(id: number): Promise<IUser> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/users/${id}`, { headers }));
  }

  async updateUser(usuarioId: number, datosEditados: IUserEditForm): Promise<IUser> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return await lastValueFrom(this.httpClient.put<IUser>(`${this.baseUrl}/users/${usuarioId}`, datosEditados, { headers }));
  }

  async deleteById(usuarioId: number): Promise<IUser> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return await lastValueFrom(this.httpClient.delete<IUser>(`${this.baseUrl}/users/${usuarioId}`, { headers }));
  }

  async updateRole(usuarioId: number, nuevoRol: string): Promise<IUser> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const body = { role: nuevoRol };
    return await lastValueFrom(this.httpClient.patch<IUser>(`${this.baseUrl}/users/${usuarioId}/role`, body, { headers }));
  }

  async updateStatus(usuarioId: number, nuevoEstado: string): Promise<IUser> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const body = { status: nuevoEstado };
    return await lastValueFrom(this.httpClient.patch<IUser>(`${this.baseUrl}/users/${usuarioId}/status`, body, { headers }));
  }
  async getGlobalStats(): Promise<IGlobalStatsPayload> {
  const token = localStorage.getItem('token'); 
  const opciones = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch('http://localhost:3000/api/admin/stats', opciones); 
  
  if (!response.ok) {
    throw new Error(`Error de conexión: ${response.status} - No autorizado`);
  }
  const datos: IGlobalStatsPayload = await response.json();
  this.cacheEstadisticas = datos; 
  
  return datos;
}
}
