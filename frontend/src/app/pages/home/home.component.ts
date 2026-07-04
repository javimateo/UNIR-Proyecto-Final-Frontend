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
  items = signal<IItem[]>([]);
  isLoading = signal<boolean>(false);
  searchQuery:string = '';
  
  // Variables de control de paginación
  currentPage = 1;
  totalPages = 1;
  perPage = 6;

  // Filtros vinculados por [(ngModel)] en tu HTML
  
  selectedCategory : number | null = null; 
  selectedCondition:string = ''; // '' 
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
    await this.loadItems(1);
    this.itemService.getCategories().then(data => this.categories = data);

  }

  // Carga las categorías reales desde tu backend
  private async loadCategories(): Promise<void> {
    try {
      this.categories = await this.itemService.getCategories();
    } catch (error) {
      console.error('Error al cargar categorías de la API:', error);
    }
  }


async loadItems(page: number = 1) {
  this.isLoading.set(true);
  try {
    // Construimos el objeto de filtros
    const filters: any = { 
      page: page, 
      per_page: this.perPage,
      search: this.searchQuery 
    };

    // Solo añadimos los filtros si tienen valor
    if (this.selectedCategory) filters.category_id = this.selectedCategory;
    if (this.selectedCondition) filters.item_condition = this.selectedCondition;
    if (this.minPrice !== null) filters.min_price = this.minPrice;
    if (this.maxPrice !== null) filters.max_price = this.maxPrice;

    const response = await this.itemService.getAll(filters) as any;
    
    this.items.set(response.results);
    this.currentPage = response.page;
    this.totalPages = response.total_pages;
  } catch (error) {
    console.error("Error al cargar:", error);
  } finally {
    this.isLoading.set(false);
  }
}

  
  onSearch(): void {
  console.log("Lo que el usuario ha escrito es:", this.searchQuery); // Cambia el log aquí también
  this.loadItems(1);
}

  // Restablece todos los filtros a su estado original
  clearFilters(){
    this.searchQuery = '';
    this.selectedCategory = null;
    this.selectedCondition = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.loadItems(1);
  }

  // Control de cambio de página con scroll arriba automático
 async changePage(newPage: number) {
  if (newPage >= 1 && newPage <= this.totalPages) {
    this.currentPage = newPage;
    await this.loadItems(this.currentPage); // Llama a la carga con la nueva página
  }
}
  // Generador de array para pintar la paginación en el HTML
  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}