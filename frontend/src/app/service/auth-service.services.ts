import { Injectable } from '@angular/core';
import { AuthResponse, LoginCredentials } from '../interface/auth-response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceServices {
  private apiUrl = 'http://localhost:3000/api/auth'

constructor (private http: HttpClient){}

login(credentials: LoginCredentials) {
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  getProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    
    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      tap(user => {
        localStorage.setItem('role', user.role);
      })
    );
  }

getRole(): string |null {
  return localStorage.getItem('role')
}
}
