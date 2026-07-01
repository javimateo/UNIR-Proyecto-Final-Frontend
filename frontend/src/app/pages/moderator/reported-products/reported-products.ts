import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reported-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reported-products.html',
  styleUrls: ['./reported-products.css']
})
export class ReportedProductsComponent {

  reportes = [

    {
      id:1,
      producto:"Samsung QLED 55\"",
      vendedor:"Juan Pérez",
      motivo:"Información falsa",
      fecha:"12/06/2026",
      estado:"Pendiente"
    },

    {
      id:2,
      producto:"LG OLED C3",
      vendedor:"María Gómez",
      motivo:"Producto inexistente",
      fecha:"13/06/2026",
      estado:"Pendiente"
    },

    {
      id:3,
      producto:"Sony Bravia 65\"",
      vendedor:"Carlos Ruiz",
      motivo:"Spam",
      fecha:"14/06/2026",
      estado:"Pendiente"
    },

    {
      id:4,
      producto:"Philips Ambilight",
      vendedor:"Laura Martín",
      motivo:"Fotos engañosas",
      fecha:"15/06/2026",
      estado:"Pendiente"
    }

  ];

}