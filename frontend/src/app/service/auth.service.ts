import { Injectable, signal, computed } from '@angular/core';
import { IUser } from '../interface/iuser.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signal para almacenar el usuario actual logueado
  private currentUserSignal = signal<Partial<IUser> | null>(null);

  // Selector computado expuesto públicamente
  currentUser = computed(() => this.currentUserSignal());
  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor() {
    // Intentar recuperar sesión existente al iniciar
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        this.currentUserSignal.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user_session');
      }
    }
  }

  // Simular login
  login(email: string): void {
    const user: Partial<IUser> = {
      id: 1,
      username: 'Jonathan',
      apellido: 'Mateo',
      email: email,
      role: 'user' // 'user' | 'moderator' | 'admin'
    };
    localStorage.setItem('user_session', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  // Simular logout
  logout(): void {
    localStorage.removeItem('user_session');
    this.currentUserSignal.set(null);
  }

  // Establecer usuario logueado tras registro
  setCurrentUser(user: Partial<IUser>): void {
    localStorage.setItem('user_session', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }
}
