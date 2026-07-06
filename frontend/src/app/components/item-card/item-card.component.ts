import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IItem } from '../../interface/iitem.interface';
import { FavoritesService } from '../../service/favorites.service';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent {
  favs = inject(FavoritesService);

  item = input.required<IItem>();
  showHeart = input<boolean>(true);

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favs.toggle(this.item().id);
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
