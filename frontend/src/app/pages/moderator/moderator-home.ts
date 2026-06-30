import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-moderator-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './moderator-home.html',
  styleUrls: ['./moderator-home.css']
})
export class ModeratorHomeComponent {

  reportesPendientes = 12;

  incidenciasAbiertas = 4;

}