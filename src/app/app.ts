import { Component } from '@angular/core';
import { CartListComponent } from './cart-list/cart-list.component';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CartListComponent, CartSummaryComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'carrito-compra';
}