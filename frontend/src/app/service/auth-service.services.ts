import { Injectable, isDevMode } from '@angular/core';
import { AuthResponse, LoginCredentials } from '../interface/auth-response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceServices {
  private isProduction(): boolean {
    return !isDevMode() && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  }

  private get apiUrl(): string {
    return this.isProduction()
      ? 'https://unir-proyecto-final-backend-production.up.railway.app/api/auth'
      : 'http://localhost:3000/api/auth';
  }

constructor (private http: HttpClient){}

login(credentials: LoginCredentials) {
    // Aquí le añadimos el /login al final
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
