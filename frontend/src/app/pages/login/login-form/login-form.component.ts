import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.loginForm.get(controlName)?.hasError(errorName) && this.loginForm.get(controlName)?.touched;
  }

  async getDataForm() {
    if (this.loginForm.valid) {
      try {
        console.log('Datos de login enviados:', this.loginForm.value);
        this.authService.login(this.loginForm.value.email);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error en el login:', error);
      }
    }
  }
}
