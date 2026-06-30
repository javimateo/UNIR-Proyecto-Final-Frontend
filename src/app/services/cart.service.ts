import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: any[] = [];

  constructor() {}

  getItems() {
    return this.items;
  }

  calculateShipping(postalCode: string) {
    console.log('Calculando envío para:', postalCode);
  }
}