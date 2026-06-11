import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceServices } from '../../../service/auth-service.services';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  private router = inject(Router);
  private authService = inject(AuthServiceServices)
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
        const response = await firstValueFrom (this.authService.login(this.loginForm.value))

        console.log('Datos de login enviados:', this.loginForm.value);
        
        const role = this.authService.getRole()

        if(role == 'ADMIN'){
          this.router.navigate(['/admin-dashboard'])
        }else if (role === 'MODERATOR'){
          this.router.navigate(['/mod-dashboard'])
        }else{
          this.router.navigate(['/home'])
        }
        
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error en el login:', error);
      }
    }else{
      this.loginForm.markAllAsTouched()
    }
  }
}
