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

private arrayCatService = inject (ICategoriaFormServices)
private categories = signal <ICategoriaForm>

 categoriesFake = [
   {id: 1, name: 'Electrónica', description: 'Móviles, ordenadores, consolas y accesorios.', totalArticulos: 145 },
    { id: 2, name: 'Ropa y Calzado', description: 'Moda de hombre, mujer, niños y complementos.', totalArticulos: 382 },
    { id: 3, name: 'Libros y Música', description: 'Novelas, libros de texto, vinilos y CD.', totalArticulos: 92 },
    { id: 4, name: 'Hogar y Decoración', description: 'Muebles, herramientas y utensilios de cocina.', totalArticulos: 210 }
  ]



  formCategoria!: FormGroup
  categoriaEditandoId: number | null = null

  ngOnInit(){
    this.initFormulario()
  }

  initFormulario(){
    this.formCategoria = new FormGroup({
      name: new FormControl ('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl ( '', [Validators.required, Validators.maxLength(100)]),
      
    })
  }

  agregarCategoria(){
    if(this.formCategoria.invalid){
      this.formCategoria.markAllAsTouched()
      return
    }
    const nuevosDatos = this.formCategoria.value as ICategoriaForm
    const nuevoId = this.categoriesFake.length>0
    ? Math.max(...this.categoriesFake.map(c => c.id)) +1 :1

    this.categoriesFake.push({
      id:nuevoId,
      name: nuevosDatos.name,
      description:nuevosDatos.description,
      totalArticulos:nuevosDatos.totalArticulos


    })
    this.formCategoria.reset
    
    Swal.fire({
      toast:true,
      position: 'top-end',
      icon: 'success',
      title: 'categoría creada con éxito',
      showConfirmButton:false,
      timer: 2000

    })
  }
  eliminarCategoria(id: number, nombre: string) {
    Swal.fire({
      title: `¿Eliminar "${nombre}"?`,
      text: "¡Cuidado! Si eliminas la categoría, los artículos asociados podrían quedarse sin clasificación.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar catálogo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Filtramos para removerla
        this.categoriesFake = this.categoriesFake.filter(c => c.id !== id);

        Swal.fire('¡Borrada!', 'La categoría ha sido eliminada.', 'success');
      }
    });
  }

  abrirModalEditar(categoria: any) {
    Swal.fire({
      title: 'Editar Categoría',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${categoria.nombre}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Descripción" value="${categoria.descripcion}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombreInput = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const descInput = (document.getElementById('swal-input2') as HTMLInputElement).value;
        
        if (!nombreInput || !descInput) {
          Swal.showValidationMessage('Por favor rellena todos los campos');
        }
        return { nombre: nombreInput, descripcion: descInput };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // Buscamos la categoría local y actualizamos sus campos
        const cat = this.categoriesFake.find(c => c.id === categoria.id);
        if (cat) {
          cat.name = result.value.nombre;
          cat.description = result.value.descripcion;
          
          Swal.fire('¡Actualizada!', 'Los cambios se han guardado.', 'success');
        }
      }
    });
  }

}
