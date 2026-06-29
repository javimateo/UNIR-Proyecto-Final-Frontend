import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  televisores = [
    {
      marca: 'Samsung 55" QLED',
      estado: 'Como nuevo',
      ubicacion: 'Madrid',
      precio: 950,
      imagen: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600'
    },
    {
      marca: 'Sony Bravia 65"',
      estado: 'Excelente',
      ubicacion: 'Barcelona',
      precio: 1450,
      imagen: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600'
    },
    {
      marca: 'LG OLED C2 48"',
      estado: 'Muy bueno',
      ubicacion: 'Valencia',
      precio: 780,
      imagen: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600'
    },
    {
      marca: 'Philips Ambilight 75"',
      estado: 'Reacondicionado',
      ubicacion: 'Sevilla',
      precio: 1100,
      imagen: 'https://images.unsplash.com/photo-1577979749830-f1d742b96791?w=600'
    }
  ];

}