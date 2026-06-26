import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser, IUserListResponse } from '../interface/iuser.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IUserServices {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api'; 

  
  getAllPromises(url: string = ''): Promise<IUserListResponse> {
    const miUrl = (url === "") ? `${this.baseUrl}/users` : url; 
    return lastValueFrom(this.httpClient.get<IUserListResponse>(miUrl));
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
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/users/${id}`));
  }

  async deleteById(usuarioId :number):Promise<IUser>{
    try{

     return await lastValueFrom(this.httpClient.delete<IUser>(`${this.baseUrl}/users/${usuarioId}`))
    }catch (error){
      throw error
    }

  }
}
