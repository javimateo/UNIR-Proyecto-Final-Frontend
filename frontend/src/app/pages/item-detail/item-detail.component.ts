import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService } from '../../service/item.service';
import { AuthService } from '../../service/auth.service';
import { IItem } from '../../interface/iitem.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private itemService = inject(ItemService);
  public authService = inject(AuthService);
  item = signal<IItem | null>(null);

  
  activePhoto = '';
  isLoading: boolean = true;

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.loadItem(+itemId);
    } else {
      this.isLoading = false;
    }
  }

  async loadItem(id: number): Promise<void> {
  this.isLoading = true;
  try {
    // 1. Guardamos el resultado directo de la API en una constante temporal
    const product = await this.itemService.getById(id);
    
    // 2. Introducimos el objeto dentro del Signal usando .set()
    this.item.set(product);

    // 3. Evaluamos la foto usando la constante temporal
    if (product && product.cover_photo) {
      this.activePhoto = product.cover_photo;
    }
  } catch (error) {
    console.error('Error al cargar el detalle del anuncio:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo encontrar el anuncio solicitado.',
      icon: 'error',
      confirmButtonColor: '#dc3545',
    });
    this.router.navigate(['/home']);
  } finally {
    this.isLoading = false;
  }
}

  // Cambiar la foto principal por la seleccionada en las miniaturas
  setActivePhoto(photoUrl: string): void {
    this.activePhoto = photoUrl;
  }

  // Simular la acción de contacto
  async onContact(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      Swal.fire('Inicia sesión', 'Debes iniciar sesión para contactar al vendedor.', 'info');
      this.router.navigate(['/login']);
      return;
    }

    const { value: text } = await Swal.fire({
      title: `Contactar a ${this.item()?.user?.username || 'Vendedor'}`,
      input: 'textarea',
      inputLabel: 'Escribe tu mensaje para iniciar el chat',
      inputPlaceholder: 'Hola, estoy interesado en tu artículo...',
      inputAttributes: {
        'aria-label': 'Escribe tu mensaje aquí'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar mensaje',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d'
    });

    if (text) {
      Swal.fire({
        title: '¡Mensaje Enviado!',
        text: 'Tu mensaje ha sido enviado con éxito. Puedes seguir la conversación en tus chats.',
        icon: 'success',
        confirmButtonColor: '#198754'
      });
    }
  }

  // Simular reporte de anuncio
  async onReport(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      Swal.fire('Inicia sesión', 'Debes iniciar sesión para reportar un artículo.', 'info');
      return;
    }

    const { value: reason } = await Swal.fire({
      title: 'Reportar Anuncio',
      input: 'select',
      inputOptions: {
        inappropriate: 'Contenido inapropiado / ofensivo',
        scam: 'Sospecha de fraude / estafa',
        counterfeit: 'Copia o falsificación',
        wrong_category: 'Categoría incorrecta',
        other: 'Otro motivo'
      },
      inputPlaceholder: 'Selecciona un motivo',
      showCancelButton: true,
      confirmButtonText: 'Enviar Reporte',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    });

    if (reason) {
      if (this.item()) {
  // 1. Para modificar un objeto dentro de un Signal, usamos .update() de forma inmutable
  this.item.update(current => current ? { ...current, status: 'under_review' } : null);
  
  // 2. Para leer la ID y pasársela al servicio, invocamos al Signal con paréntesis ()
  await this.itemService.update(this.item()!.id, { status: 'under_review' });
}

      Swal.fire({
        title: 'Reportado con éxito',
        text: 'El anuncio ha sido enviado al equipo de moderación para su revisión.',
        icon: 'warning',
        confirmButtonColor: '#dc3545'
      });
    }
  }

  // Helpers para traducciones de estados
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

  // Verificar si el usuario actual es el dueño del anuncio
  isOwner(): boolean {
    const currentUser = this.authService.currentUser();
    return !!currentUser && !!this.item() && this.item()!.user_id === currentUser.id;
  }

  // Verificar si es favorito
  isFavorite(): boolean {
    if (!this.item()) return false;
    const currentUser = this.authService.currentUser();
    const favKey = currentUser ? `favs_${currentUser.username}` : 'favs_guest';
    const savedFavs: number[] = JSON.parse(localStorage.getItem(favKey) || '[]');
    return savedFavs.includes(this.item()!.id);
  }

  // Alternar favorito
  toggleFavorite(): void {
    if (!this.item() || !this.item()!.id) return;
    const currentUser = this.authService.currentUser();
    const favKey = currentUser ? `favs_${currentUser.username}` : 'favs_guest';
    let savedFavs: number[] = JSON.parse(localStorage.getItem(favKey) || '[]');

    if (savedFavs.includes(this.item()!.id)) {
      savedFavs = savedFavs.filter(favId => favId !== this.item()!.id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Eliminado de favoritos',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      savedFavs.push(this.item()!.id);
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
}
