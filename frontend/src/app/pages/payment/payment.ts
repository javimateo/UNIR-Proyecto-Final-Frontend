import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ItemService } from '../../service/item.service';
import { IItem } from '../../interface/iitem.interface';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class PaymentComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private itemService = inject(ItemService);

  nombre = '';
  email = '';
  telefono = '';

  direccion = '';
  ciudad = '';
  codigoPostal = '';

  aceptar = false;
  compraConfirmada = false;

  producto: IItem | null = null;

  async ngOnInit(): Promise<void> {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      return;
    }

    try {

      this.producto = await this.itemService.getById(id);

      console.log(this.producto);

    } catch (error) {

      console.error('Error cargando el artículo', error);

    }

  }

  confirmarCompra(): void {

    if (
      this.nombre &&
      this.email &&
      this.telefono &&
      this.direccion &&
      this.ciudad &&
      this.codigoPostal &&
      this.aceptar
    ) {

      this.compraConfirmada = true;

    }

  }

}