import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service'; // Con la "S" porque tu carpeta es services

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css']
})
export class CartSummaryComponent {
  postalCode: string = '';
  couponCode: string = '';
  subtotal: number = 0;
  discount: number = 0;
  shippingCost: number = 0;
  total: number = 0;
  couponMessage: string = '';
  isCouponValid: boolean = false;

  constructor(private cartService: CartService) {}

  onCalculateShipping() {
    this.cartService.calculateShipping(this.postalCode);
  }

  onApplyCoupon() {
    console.log('Aplicando cupón:', this.couponCode);
    this.couponMessage = 'Cupón procesado';
    this.isCouponValid = true;
  }
}