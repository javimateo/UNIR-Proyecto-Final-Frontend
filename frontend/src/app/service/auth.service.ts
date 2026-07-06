import { Injectable, signal, computed, inject, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, firstValueFrom } from 'rxjs';
import { IUser } from '../interface/iuser.interface';
import { AuthResponse, LoginCredentials } from '../interface/auth-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private isProduction(): boolean {
    return !isDevMode() && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  }

  private get apiUrl(): string {
    return this.isProduction()
      ? 'https://unir-proyecto-final-backend-production.up.railway.app/api/auth'
      : 'http://localhost:3000/api/auth';
  }

  private currentUserSignal = signal<Partial<IUser> | null>(null);

  currentUser = computed(() => this.currentUserSignal());
  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor() {
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        this.currentUserSignal.set(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user_session');
      }
    }
  }

  login(credentials: LoginCredentials) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  async fetchProfile(): Promise<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const user = await firstValueFrom(this.http.get<Partial<IUser>>(`${this.apiUrl}/me`, { headers }));
    localStorage.setItem('user_session', JSON.stringify(user));
    localStorage.setItem('role', user.role ?? 'user');
    this.currentUserSignal.set(user);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_session');
    this.currentUserSignal.set(null);
  }

  setCurrentUser(user: Partial<IUser>): void {
    localStorage.setItem('user_session', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }
}
