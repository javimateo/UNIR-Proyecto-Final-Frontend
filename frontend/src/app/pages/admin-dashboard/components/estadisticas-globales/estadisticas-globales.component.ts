import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { IUserServices } from '../../../../service/iuser.services';
import { IGlobalStatsPayload } from '../../../../interface/iuser.interface';

@Component({
  selector: 'app-estadisticas-globales',
  standalone: true,
  imports: [],
  templateUrl: './estadisticas-globales.component.html',
  styleUrl: './estadisticas-globales.component.css',
})
export class EstadisticasGlobalesComponent implements OnInit {
  
  // Cambiamos el tipo por la nueva interfaz combinada
  estadisticas: IGlobalStatsPayload | null = null;

  private userService = inject(IUserServices);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.cargarEstadisticas();
  }

  async cargarEstadisticas() {
    // 1. CARGA INMEDIATA: Si ya hay estadísticas precargadas, se muestran en 0ms
    if (this.userService.cacheEstadisticas) {
      this.estadisticas = this.userService.cacheEstadisticas;
    }

    // 2. SEGUNDO PLANO: Busca actualizaciones del backend en silencio
    try {
      this.estadisticas = await this.userService.getGlobalStats();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al traer estadísticas del back:', error);
    }
  }
}