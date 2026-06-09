import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser, IUserListResponse } from '../interface/iuser.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IUserServices {
  private httpClient = inject(HttpClient);
  private baseUrl = 'https://localhost:3000/api/users';

  getAllPromises(url: string= ''): Promise<IUserListResponse> {
    const miUrl = (url === "") ? this.baseUrl : url;
    return lastValueFrom(this.httpClient.get<IUserListResponse>(miUrl));

}
  getById(id:number): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/${id}`));
  }

   create(formValue: IUser): Promise<IUser> {
    const userToSave: Partial<IUser> = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      email: formValue.email,
      password: formValue.password
    };
    return lastValueFrom(this.httpClient.post<IUser>(this.baseUrl, userToSave));
  }
}
