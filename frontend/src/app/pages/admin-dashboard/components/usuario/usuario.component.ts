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
      avatar_url: new FormControl('', [
        Validators.pattern(/^(https?:\/\/)?([a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+)$/),
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
    console.log(`Intentando cambiar estado del usuario ${usuario.username}...`);
    
    try {
      
      const nuevoEstado = usuario.status === 'active' ? 'blocked' : 'active';
      
      
      await this.userService.updateStatus(usuario.id, nuevoEstado);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Usuario ${nuevoEstado === 'active' ? 'desbloqueado' : 'bloqueado'} con éxito`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Swal.fire('Error', 'Hubo un problema de conexión al cambiar el estado.', 'error');
      
    } finally {
      
      console.log('Refrescando usuarios desde la base de datos...');
      await this.cargarUsuarios();
    }
  }

  seleccionarUsuarioParaEditar(usuario: IUser) {
    this.usuariosSeleccionadosId = usuario.id;
    this.miFormularioEdicion.patchValue({
      username: usuario.username,
      avatar_url: usuario.avatar_url || '',
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
        // 1. Obtenemos los datos del formulario (username, avatar_url, role)
        const datosEditados = this.miFormularioEdicion.value;
        
        // 2. Buscamos al usuario original en nuestra lista para rescatar su email intacto
        const usuarioOriginal = this.listaUsuariosMostrar.find(u => u.id === this.usuariosSeleccionadosId);

        // 3. Creamos el paquete final juntando lo del formulario y el email obligatorio
        const datosParaEnviar = {
          ...datosEditados,          // Esparce username, avatar_url y role
          email: usuarioOriginal?.email // Añade el email original que exige el backend
        };

        console.log('Datos enviados a updateUser con email incluido:', datosParaEnviar);

        // 4. Enviamos el nuevo objeto "datosParaEnviar" al servidor
        await this.userService.updateUser(this.usuariosSeleccionadosId, datosParaEnviar as any);
        
        // Actualizamos el rol (esto se queda igual)
        await this.userService.updateRole(this.usuariosSeleccionadosId, datosEditados.role);

        Swal.fire({
          icon: 'success',
          title: '¡Usuario Actualizado!',
          text: 'Los cambios se guardaron con éxito.',
          timer: 2000,
          showConfirmButton: false,
        });

      } catch (error) {
        console.error('Error al actualizar:', error);
        Swal.fire('Error', 'Hubo un problema al guardar los datos.', 'error');
      } finally {
        this.usuariosSeleccionadosId = null;
        this.miFormularioEdicion.reset();
        await this.cargarUsuarios(); // Esto refrescará la tabla y pintará la foto
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