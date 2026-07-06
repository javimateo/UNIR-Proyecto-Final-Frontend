import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class PaymentComponent {

  // Datos del comprador
  nombre = '';
  email = '';
  telefono = '';

  // Tarjeta
  titular = '';
  numeroTarjeta = '';
  caducidad = '';
  cvv = '';

  // Dirección
  direccion = '';
  ciudad = '';
  codigoPostal = '';

  aceptar = false;

  total = 599;

  procesando = false;
  pagoCorrecto = false;

  tipoTarjeta = 'TARJETA';

  colorTarjeta = 'visa';

  formatearNumero() {

    let numero = this.numeroTarjeta.replace(/\D/g, '');

    numero = numero.substring(0,16);

    this.numeroTarjeta = numero.replace(/(.{4})/g,'$1 ').trim();

    this.detectarTarjeta();

  }

  detectarTarjeta(){

    const numero = this.numeroTarjeta.replace(/\s/g,'');

    if(numero.startsWith('4')){

      this.tipoTarjeta = 'VISA';
      this.colorTarjeta = 'visa';

    }

    else if(numero.startsWith('34') || numero.startsWith('37')){

      this.tipoTarjeta = 'AMERICAN EXPRESS';
      this.colorTarjeta = 'amex';

    }

    else{

      this.tipoTarjeta = 'TARJETA';
      this.colorTarjeta = 'visa';

    }

  }

 pagar(){

  if(
    this.nombre &&
    this.email &&
    this.telefono &&
    this.titular &&
    this.numeroTarjeta &&
    this.caducidad &&
    this.cvv &&
    this.direccion &&
    this.ciudad &&
    this.codigoPostal &&
    this.aceptar
  ){

    setTimeout(() => {

      this.pagoCorrecto = true;

    },1000);

  }

}

}