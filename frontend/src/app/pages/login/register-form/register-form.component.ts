import { Component, inject, isDevMode } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IUserServices } from '../../../service/iuser.services';
import { AuthService } from '../../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  private userServices = inject(IUserServices);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    }, {
      validators: (group) => {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordMismatch: true };
      }
    });
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.registerForm.get(controlName)?.hasError(errorName) && this.registerForm.get(controlName)?.touched;
  }

  async getDataForm() {
    if (this.registerForm.valid) {
      try {
        const { confirmPassword, ...formData } = this.registerForm.value;

        // Intentar registrar en el backend.
        let createdUser;
        try {
          createdUser = await this.userServices.create(formData);
        } catch (backendError) {
          const isProduction = !isDevMode() && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
          if (isProduction) {
            throw backendError;
          }
          
          createdUser = {
            id: Date.now(),
            username: formData.username,
            apellido: formData.apellido,
            email: formData.email,
            role: 'user'
          };
        }

        this.authService.setCurrentUser(createdUser);

        await Swal.fire({
          title: '¡Creado!',
          text: 'Usuario creado con éxito',
          icon: 'success',
          confirmButtonColor: '#13a547',
        });

        this.router.navigate(['/home']);
        
      } catch (error) {
        console.error("Error al registrar:", error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al crear tu cuenta. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#f00404',
        });
      }
    } else {
      this.registerForm.markAllAsTouched()
      Swal.fire('Formulario incompleto', 'Por favor, revisa los campos en rojo', 'info');
    }
  }
}