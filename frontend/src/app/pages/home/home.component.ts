import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../service/item.service';
import { IItem } from '../../interface/iitem.interface';
import { ItemCardComponent } from '../../components/item-card/item-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private itemService = inject(ItemService);

  // Signals para el estado de los datos y la carga
  items = signal<IItem[]>([]);
  isLoading = signal<boolean>(false);
  
  // Variables de control de paginación
  currentPage = 1;
  totalPages = 1;
  perPage = 6;

  // Filtros vinculados por [(ngModel)] en tu HTML
  searchQuery = '';
  selectedCategory = 0; // 0 = Todas
  selectedCondition = ''; // '' = Todos
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Listado de categorías dinámicas que vendrán de la API
  categories: { id: number; name: string }[] = [];

  // Opciones fijas del selector de estado de conservación
  conditions = [
    { value: 'new', label: 'Nuevo' },
    { value: 'like_new', label: 'Como nuevo' },
    { value: 'good', label: 'Buen estado' },
    { value: 'fair', label: 'Aceptable' },
    { value: 'poor', label: 'Gastado' }
  ];

  async ngOnInit(): Promise<void> {
    // Cargamos tanto las categorías de la BD como los anuncios iniciales
    await this.loadCategories();
    await this.loadItems();
  }

  // Carga las categorías reales desde tu backend
  private async loadCategories(): Promise<void> {
    try {
      this.categories = await this.itemService.getCategories();
    } catch (error) {
      console.error('Error al cargar categorías de la API:', error);
    }
  }

  // Carga los artículos 
  async loadItems() {
    try {
      const response = await this.itemService.getAllItems();
console.log("Respuesta completa de la API:", response); // 👈 Mira esto en F12 -> Consola
this.items.set(response);

    }catch (error) {
      throw error
  

  }
}

  // Ejecuta la búsqueda volviendo a la primera página
  onSearch(): void {
    this.loadItems();
  }

  // Restablece todos los filtros a su estado original
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 0;
    this.selectedCondition = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.loadItems();
  }

  // Control de cambio de página con scroll arriba automático
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadItems();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Generador de array para pintar la paginación en el HTML
  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}