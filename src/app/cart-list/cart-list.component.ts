import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service'; // Con la "S" porque tu carpeta es services

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {
  items: any[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.items = [
      { id: 1, name: 'Producto de prueba', price: 10, quantity: 1 }
    ];
  }

  onRemoveItem(id: number): void {
    console.log('Eliminando producto con ID:', id);
    this.items = this.items.filter(item => item.id !== id);
  }
}