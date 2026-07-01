import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './report-detail.html',
  styleUrl: './report-detail.css'
})
export class ReportDetailComponent {

  reporte = {

    producto: 'Samsung QLED 55"',
    precio: 950,
    vendedor: 'Juan Pérez',
    ubicacion: 'Madrid',
    estado: 'Como nuevo',

    imagen: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=900',

    motivo: 'El usuario indica que las fotografías del anuncio no corresponden con el televisor ofertado.',

    descripcion: `Televisor Samsung QLED de 55 pulgadas,
    muy cuidado, con mando original y caja.
    Se vende por cambio a un modelo superior.`

  };

}