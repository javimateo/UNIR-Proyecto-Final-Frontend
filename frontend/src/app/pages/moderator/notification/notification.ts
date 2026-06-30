import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class NotificationComponent {

  asunto = '';

  mensaje = '';

  enviada = false;

  enviar(){

    this.enviada = true;

  }

}