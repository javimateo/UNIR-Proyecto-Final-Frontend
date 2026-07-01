import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  standalone: true,
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent {

  historial = [

    {
      fecha: '18/06/2026',
      hora: '09:35',
      accion: 'Anuncio retirado',
      producto: 'Samsung QLED 55"',
      usuario: 'Juan Pérez',
      resultado: 'Retirado'
    },

    {
      fecha: '18/06/2026',
      hora: '10:12',
      accion: 'Reporte revisado',
      producto: 'LG OLED C3',
      usuario: 'María Gómez',
      resultado: 'Mantenido'
    },

    {
      fecha: '18/06/2026',
      hora: '11:48',
      accion: 'Incidencia resuelta',
      producto: 'Sony Bravia 65"',
      usuario: 'Carlos Ruiz',
      resultado: 'Resuelta'
    },

    {
      fecha: '19/06/2026',
      hora: '08:20',
      accion: 'Anuncio retirado',
      producto: 'Philips Ambilight',
      usuario: 'Laura Martín',
      resultado: 'Retirado'
    }

  ];

}