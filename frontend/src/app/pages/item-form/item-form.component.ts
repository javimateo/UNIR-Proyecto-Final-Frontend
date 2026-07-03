import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService } from '../../service/item.service';
import { AuthService } from '../../service/auth.service';
import { IItem } from '../../interface/iitem.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private itemService = inject(ItemService);
  private authService = inject(AuthService);

  itemForm!: FormGroup;
  isEditMode: boolean = false;
  itemId: number | null = null;
  isLoading: boolean = false;
  categories: { id: number; name: string }[] = [];
  conditions: { value: string; label: string }[] = [];

  uploadedPhotos: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.loadSelectOptions()

    if (!this.authService.isLoggedIn()) {
      Swal.fire(
        'Acceso denegado',
        'Debes iniciar sesión para publicar o editar artículos.',
        'warning',
      );
      this.router.navigate(['/login']);
      return;
    }

    // Comprobar si hay un ID en la ruta (Edición)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.itemId = +idParam;
      this.loadItemData(this.itemId);
    }
  }

  // Inicializar el formulario reactivo con validaciones robustas
  private initForm(): void {
    this.itemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(1)]],
      category_id: ['', [Validators.required]],
      item_condition: ['', [Validators.required]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(1000)]],
    });
  }

  
 private async loadSelectOptions(): Promise<void> {
    try {
      
      this.categories = await this.itemService.getCategories();
      this.conditions = [
        { value: 'new', label: 'Nuevo' },
        { value: 'like_new', label: 'Como nuevo' },
        { value: 'good', label: 'Buen estado' },
        { value: 'fair', label: 'Aceptable' },
        { value: 'poor', label: 'En mal estado' }
      ];
    } catch (error) {
      console.error('Error al cargar las opciones del formulario:', error);
    }
  }

  // Cargar datos previos para el modo de edición
  private async loadItemData(id: number): Promise<void> {
    this.isLoading = true;
    try {
      const item = await this.itemService.getById(id);

      const currentUser = this.authService.currentUser();
      if (item.user_id !== currentUser?.id) {
        Swal.fire('No autorizado', 'Solo el propietario de este anuncio puede editarlo.', 'error');
        this.router.navigate(['/home']);
        return;
      }

      this.itemForm.patchValue({
        title: item.title,
        price: item.price,
        category_id: item.category_id,
        item_condition: item.item_condition,
        location: item.location,
        description: item.description,
        
      });

      if (item.cover_photo) {
        this.uploadedPhotos = [item.cover_photo];
      }
    } catch (error) {
      console.error('Error al cargar datos del anuncio:', error);
      Swal.fire('Error', 'No se pudo cargar el anuncio.', 'error');
      this.router.navigate(['/home']);
    } finally {
      this.isLoading = false;
    }
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    const control = this.itemForm.get(controlName);
    return control?.hasError(errorName) && (control?.touched || control?.dirty);
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.uploadedPhotos.push(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  }

  // Eliminar una imagen cargada de la lista
  removePhoto(index: number): void {
    this.uploadedPhotos.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      Swal.fire(
        'Formulario inválido',
        'Por favor, rellena correctamente todos los campos obligatorios.',
        'info',
      );
      return;
    }

    this.isLoading = true;
    const currentUser = this.authService.currentUser();
    const itemData: IItem = {
      ...this.itemForm.value,
      category_id: +this.itemForm.value.category_id,
      user_id: currentUser?.id,
      photos: this.uploadedPhotos,
    };

    try {
      if (this.isEditMode && this.itemId) {
        await this.itemService.update(this.itemId, itemData);
        await Swal.fire({
          title: '¡Anuncio Guardado!',
          text: 'Los cambios se han guardado con éxito.',
          icon: 'success',
          confirmButtonColor: '#198754',
        });
        this.router.navigate(['/anuncio', this.itemId]);
      } else {
        const newItem = await this.itemService.create(itemData);
        await Swal.fire({
          title: '¡Publicado!',
          text: 'Tu anuncio ha sido publicado con éxito en ReMarket.',
          icon: 'success',
          confirmButtonColor: '#198754',
        });
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error al guardar el anuncio:', error);
      Swal.fire('Error', 'Hubo un problema al guardar tu anuncio. Inténtalo de nuevo.', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
