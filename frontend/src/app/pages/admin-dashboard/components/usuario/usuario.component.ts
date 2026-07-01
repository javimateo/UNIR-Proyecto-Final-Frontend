import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { IUserServices } from '../../../../service/iuser.services';
import { IUser } from '../../../../interface/iuser.interface';
import { NgClass } from '@angular/common';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  arrayUsersPromises = signal<IUser[]>([]);
  private userService = inject(IUserServices);

  listaUsuariosMostrar: IUser[] = [];
  miFormularioEdicion!: FormGroup;
  usuariosSeleccionadosId: number | null = null;
  private cdr = inject(ChangeDetectorRef);
  ngOnInit() {
    this.cargarUsuarios();
    this.initFormulario();
  }

  initFormulario() {
    this.miFormularioEdicion = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      role: new FormControl('', [Validators.required]),
    });
  }

  async cargarUsuarios() {
    try {
      this.listaUsuariosMostrar = await this.userService.getAllPromises();
      this.cdr.detectChanges(); 
      
    } catch (error) {
      console.error('Error al cargar la lista:', error);
    }
  }

  async cambiarEstado(usuario: IUser) {
    try {
      const nuevoEstado = usuario.status === 'active' ? 'blocked' : 'active';
      // Pasamos los datos obligatorios para cumplir con IUserEditForm
      const datosActualizados = {
        username: usuario.username,
        apellido: usuario.apellido || '',
        email: usuario.email,
        role: usuario.role,
        status: nuevoEstado
      };

      await this.userService.updateUser(usuario.id, datosActualizados as any);
      await this.cargarUsuarios();

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Usuario modificado a ${nuevoEstado} con éxito`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
    }
  }

  seleccionarUsuarioParaEditar(usuario: IUser) {
    this.usuariosSeleccionadosId = usuario.id;
    this.miFormularioEdicion.patchValue({
      username: usuario.username,
      apellido: usuario.apellido,
      email: usuario.email,
      role: usuario.role,
    });
  }

  async guardarCambiosUsuario() {
    if (this.miFormularioEdicion.invalid) {
      this.miFormularioEdicion.markAllAsTouched();
      return;
    }

    if (this.usuariosSeleccionadosId !== null) {
      try {
        const datosEditados = this.miFormularioEdicion.value;
        console.log('Datos enviados a updateUser:', datosEditados);

        // 1. Actualiza campos generales (username, email, apellido)
        await this.userService.updateUser(this.usuariosSeleccionadosId, datosEditados);

        // 2. ¡LLAMADA CLAVE! Forzamos la actualización del Rol con su método exclusivo
        console.log(`Enviando nuevo rol '${datosEditados.role}' al endpoint de roles...`);
        await this.userService.updateRole(this.usuariosSeleccionadosId, datosEditados.role);

        // Limpieza del formulario
        this.usuariosSeleccionadosId = null;
        this.miFormularioEdicion.reset();

        // Recargamos la tabla para ver los cambios reflejados
        await this.cargarUsuarios();

        Swal.fire({
          icon: 'success',
          title: '¡Usuario Actualizado!',
          text: 'Los datos y el rol se guardaron con éxito.',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error al actualizar el usuario/rol:', error);
        Swal.fire('Error', 'Hubo un problema al guardar el rol en el servidor.', 'error');
      }
    }
  }

  cancelarEdicion() {
    this.usuariosSeleccionadosId = null;
    this.miFormularioEdicion.reset();
  }

  eliminarUser(usuarioId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.userService.deleteById(usuarioId);
          await this.cargarUsuarios();

          Swal.fire({
            title: '¡Eliminado!',
            text: 'El usuario ha sido borrado.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error('Error al eliminar:', error);
          Swal.fire('Error', 'No se pudo eliminar al usuario.', 'error');
        }
      }
    });
  }
}