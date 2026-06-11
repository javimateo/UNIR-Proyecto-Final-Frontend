import { Injectable } from '@angular/core';
import { AuthResponse, LoginCredentials } from '../interface/auth-response.interface';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceServices {
  private apiUrl = 'http://localhost:3000/api/auth/login'

constructor (private http: HttpClient){}

login(credentials:LoginCredentials){
  
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
      })
    );

  

}

getRole(): string |null {
  return localStorage.getItem('role')
}
}
