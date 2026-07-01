import { Component, inject, signal } from '@angular/core';
import { ICategoriaFormServices } from '../../../../service/icategoria-form.services';
import { ICategoriaForm } from '../../../../interface/icategoria-form.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css',
})
export class CategoriasComponent {

private categoriaService = inject(ICategoriaFormServices);

  
  listaCategorias: ICategoriaForm[] = [];
  formCategoria!: FormGroup;

  ngOnInit() {
    this.initFormulario();
    this.obtenerCategorias(); 
  }

  initFormulario() {
    this.formCategoria = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required])
    });
  }

  
  async obtenerCategorias() {
    try {
      
      this.listaCategorias = await this.categoriaService.getAllPromises();
    } catch (error) {
      console.error('Error al cargar catálogo:', error);
      Swal.fire('Error', 'No se pudieron recuperar las categorías del servidor.', 'error');
    }
  }


  async agregarCategoria() {
    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return;
    }

    try {
      const nuevaCat = this.formCategoria.value as ICategoriaForm;
      
      
      await this.categoriaService.create(nuevaCat);
      
      this.formCategoria.reset();
      await this.obtenerCategorias(); 

      Swal.fire({
        icon: 'success',
        title: '¡Creada!',
        text: 'Categoría guardada con éxito.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la categoría.', 'error');
    }
  }

  eliminarCategoria(id: number, nombre: string) {
    Swal.fire({
      title: `¿Eliminar "${nombre}"?`,
      text: "Esta acción borrará la categoría de la base de datos de forma permanente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          
          await this.categoriaService.delete(id);
          await this.obtenerCategorias(); 
          
          Swal.fire('¡Eliminada!', 'La categoría ha sido borrada.', 'success');
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
        }
      }
    });
  }

  abrirModalEditar(categoria: ICategoriaForm) {
  Swal.fire({
    title: 'Modificar Categoría',
    html:
      `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${categoria.name}">` +
      `<input id="swal-input2" class="swal2-input" placeholder="Descripción" value="${categoria.description}">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar cambios',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nameInput = (document.getElementById('swal-input1') as HTMLInputElement).value;
      const descInput = (document.getElementById('swal-input2') as HTMLInputElement).value;
      
      if (!nameInput || !descInput) {
        Swal.showValidationMessage('Ambos campos son obligatorios');
      }
      return { name: nameInput, description: descInput };
    }
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      try {
        
        const categoriaEditada: ICategoriaForm = {
          name: result.value.name,
          description: result.value.description
        };

        
        await this.categoriaService.update(categoria.id!, categoriaEditada);
        
        
        await this.obtenerCategorias();
        
        Swal.fire('¡Actualizada!', 'Los cambios se guardaron en la base de datos.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudieron salvar los cambios.', 'error');
      }
    }
  });
}

}
