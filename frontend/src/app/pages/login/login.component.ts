import { Component, input } from '@angular/core';
import{ LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';


@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, RegisterFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  mostrarLogin = true;


  
}

