import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TFM_UNIR');
  protected authService = inject(AuthService);
  private router = inject(Router);
  

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
