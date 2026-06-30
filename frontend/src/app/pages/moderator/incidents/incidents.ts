import { Component } from '@angular/core';

@Component({
  selector: 'app-incidents',
  standalone: true,
  templateUrl: './incidents.html',
  styleUrls: ['./incidents.css']
})
export class IncidentsComponent {

  incidencias = [

    {
      id: 1,
      comprador: 'Carlos López',
      vendedor: 'Juan Pérez',
      asunto: 'Producto no recibido',
      fecha: '15/06/2026',
      estado: 'Abierta'
    },

    {
      id: 2,
      comprador: 'Ana Ruiz',
      vendedor: 'María Gómez',
      asunto: 'Producto diferente al anunciado',
      fecha: '16/06/2026',
      estado: 'En revisión'
    },

    {
      id: 3,
      comprador: 'David Martín',
      vendedor: 'Pedro Sánchez',
      asunto: 'Problema con el pago',
      fecha: '17/06/2026',
      estado: 'Abierta'
    }

  ];

  resolver(incidencia: any){

    incidencia.estado = 'Resuelta';

  }

}