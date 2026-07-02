import { Component } from '@angular/core';
import { UsuarioComponent } from "./components/usuario/usuario.component";
import { CategoriasComponent } from "./components/categorias/categorias.component";
import { EstadisticasGlobalesComponent } from "./components/estadisticas-globales/estadisticas-globales.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [UsuarioComponent, CategoriasComponent, EstadisticasGlobalesComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  seccionActiva: string = 'usuarios'

  cambiarSeccion(seccion:string){
    this.seccionActiva = seccion

  }
}
