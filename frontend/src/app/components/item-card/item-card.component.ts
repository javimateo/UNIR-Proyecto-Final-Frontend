import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IItem } from '../../interface/iitem.interface';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent {
  authService = inject(AuthService);

  // Usamos el input signal de Angular moderno
  item = input.required<IItem>();

  // Helper para verificar si está marcado como favorito
  isFavorite(): boolean {
    if (!this.authService.isLoggedIn()) return false;
    const currentUser = this.authService.currentUser();
    const favKey = `favs_${currentUser?.username || 'global'}`;
    const savedFavs: number[] = JSON.parse(localStorage.getItem(favKey) || '[]');
    const id = this.item().id;
    return id !== undefined && savedFavs.includes(id);
  }

  // Alternar el estado de favorito
  toggleFavorite(event: Event): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      Swal.fire('Inicia sesión', 'Debes iniciar sesión para guardar favoritos.', 'info');
      return;
    }
    const currentUser = this.authService.currentUser();
    const favKey = `favs_${currentUser?.username || 'global'}`;
    let savedFavs: number[] = JSON.parse(localStorage.getItem(favKey) || '[]');
    const id = this.item().id;
    if (id === undefined) return;

    if (savedFavs.includes(id)) {
      savedFavs = savedFavs.filter(favId => favId !== id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Eliminado de favoritos',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      savedFavs.push(id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Añadido a favoritos',
        showConfirmButton: false,
        timer: 1500
      });
    }
    localStorage.setItem(favKey, JSON.stringify(savedFavs));
  }

  // Helper para traducir el estado de conservación
  getConditionLabel(condition: string): string {
    const labels: Record<string, string> = {
      new: 'Nuevo',
      like_new: 'Como nuevo',
      good: 'Buen estado',
      fair: 'Aceptable',
      poor: 'Gastado'
    };
    return labels[condition] || condition;
  }

  // Helper para asignar color a la etiqueta del estado
  getConditionClass(condition: string): string {
    const classes: Record<string, string> = {
      new: 'bg-success-subtle text-success border border-success-subtle',
      like_new: 'bg-info-subtle text-info-emphasis border border-info-subtle',
      good: 'bg-primary-subtle text-primary-emphasis border border-primary-subtle',
      fair: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
      poor: 'bg-danger-subtle text-danger border border-danger-subtle'
    };
    return classes[condition] || 'bg-secondary-subtle';
  }
}
