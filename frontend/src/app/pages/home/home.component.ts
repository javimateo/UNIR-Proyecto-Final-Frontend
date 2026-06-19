import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../service/item.service';
import { IItem } from '../../interface/iitem.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private itemService = inject(ItemService);

  // Estado del listado y paginación
  items: IItem[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  perPage: number = 6; // Mostrar 6 anuncios por página
  isLoading: boolean = false;

  // Filtros de búsqueda
  searchQuery: string = '';
  selectedCategory: number = 0; // 0 = Todas
  selectedCondition: string = ''; // '' = Todas
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Categorías fijas según BBDD.sql
  categories = [
    { id: 1, name: 'Electrónica' },
    { id: 2, name: 'Ropa y moda' },
    { id: 3, name: 'Hogar' },
    { id: 4, name: 'Deportes' },
    { id: 5, name: 'Libros' },
    { id: 6, name: 'Juguetes' },
    { id: 7, name: 'Vehículos' },
    { id: 8, name: 'Otros' }
  ];

  // Condiciones de conservación
  conditions = [
    { value: 'new', label: 'Nuevo' },
    { value: 'like_new', label: 'Como nuevo' },
    { value: 'good', label: 'Buen estado' },
    { value: 'fair', label: 'Aceptable' },
    { value: 'poor', label: 'Gastado' }
  ];

  ngOnInit(): void {
    this.loadItems();
  }

  // Cargar anuncios aplicando filtros activos
  async loadItems(page: number = 1): Promise<void> {
    this.isLoading = true;
    this.currentPage = page;
    try {
      const response = await this.itemService.getAll({
        search: this.searchQuery || undefined,
        category_id: this.selectedCategory !== 0 ? this.selectedCategory : undefined,
        item_condition: this.selectedCondition || undefined,
        min_price: this.minPrice !== null ? this.minPrice : undefined,
        max_price: this.maxPrice !== null ? this.maxPrice : undefined,
        page: this.currentPage,
        per_page: this.perPage
      });

      this.items = response.results;
      this.totalItems = response.total;
      this.totalPages = response.total_pages;
    } catch (error) {
      console.error('Error al cargar los anuncios:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Ejecutar búsqueda (vuelve a la página 1)
  onSearch(): void {
    this.loadItems(1);
  }

  // Limpiar todos los filtros y recargar
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 0;
    this.selectedCondition = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.loadItems(1);
  }

  // Navegar a una página específica
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadItems(page);
      // Hacer scroll suave hacia arriba al cambiar de página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// Importación interna del componente para evitar problemas de dependencias circulares
import { ItemCardComponent } from '../../components/item-card/item-card.component';
