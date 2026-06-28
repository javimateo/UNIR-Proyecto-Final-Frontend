import { Component, inject, signal } from '@angular/core';
import { IUserServices } from '../../../../service/iuser.services';
import { IUser, IUserEditForm } from '../../../../interface/iuser.interface';
import { NgClass } from '@angular/common';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-usuario',
  imports: [NgClass,ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  arrayUsersPromises = signal<IUser[]>([]);

  private userService = inject(IUserServices);
  private todosLosUsuariosFake: IUser[] = [
    {
      id: 1,
      username: 'admin',
      apellido: 'Pérez',
      role: 'admin',
      email: 'admin@mail.com',
      status: 'Activo',
      password: '',
    },
    {
      id: 2,
      username: 'user1',
      apellido: 'García',
      role: 'moderator',
      email: 'javi@mail.com',
      status: 'Activo',
      password: '',
    },
    {
      id: 3,
      username: 'user3',
      apellido: 'López',
      role: 'user',
      email: 'user3@mail.com',
      status: 'Activo',
      password: '',
    },
    {
      id: 4,
      username: 'user4',
      apellido: 'Martínez',
      role: 'user',
      email: 'user4@mail.com',
      status: 'Activo',
      password: '',
    },
    {
      id: 5,
      username: 'user5',
      apellido: 'Rodríguez',
      role: 'user',
      email: 'user5@mail.com',
      status: 'Bloqueado',
      password: '',
    },
    {
      id: 6,
      username: 'user6',
      apellido: 'Sánchez',
      role: 'user',
      email: 'user6@mail.com',
      status: 'Activo',
      password: '',
    },
    {
      id: 7,
      username: 'user7',
      apellido: 'Gómez',
      role: 'user',
      email: 'user7@mail.com',
      status: 'Activo',
      password: '',
    },
    {
      id: 8,
      username: 'user8',
      apellido: 'Fernández',
      role: 'user',
      email: 'user8@mail.com',
      status: 'Bloqueado',
      password: '',
    },
    {
      id: 9,
      username: 'user9',
      apellido: 'Díaz',
      role: 'user',
      email: 'user9@mail.com',
      status: 'Activo',
      password: '',
    },
    {
      id: 11,
      username: 'user10',
      apellido: 'Álvarez',
      role: 'user',
      email: 'user10@mail.com',
      status: 'Activo',
      password: '',
    },
    {
      id: 12,
      username: 'user11',
      apellido: 'Torres',
      role: 'user',
      email: 'user11@mail.com',
      status: 'Bloqueado',
      password: '',
    },
    {
      id: 13,
      username: 'user12',
      apellido: 'Ruiz',
      role: 'user',
      email: 'user12@mail.com',
      status: 'Activo',
      password: '',
    },
  ];

  listaUsuariosMostrar: IUser[] = [];
  paginaActual: number = 1;
  limitePorPagina: number = 4;
  totalUsuarios: number = 0;

  miFormularioEdicion! :FormGroup
  usuariosSeleccionadosId: number|null=null

  ngOnInit() {
    this.cargarUsuarios();
    this.totalUsuarios = this.todosLosUsuariosFake.length;
    this.cargarUsuariosSimulados();
    this.initFormulario()
  }


  initFormulario(){
    this.miFormularioEdicion = new FormGroup({
      username: new FormControl('',[Validators.required,Validators.minLength(3)]),
      apellido: new FormControl('',[Validators.required,Validators.minLength(3)]),
      email: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      status: new FormControl('',[Validators.required]),
      role: new FormControl('',[Validators.required])


    })
  }

  cargarUsuariosSimulados() {
    const inicio = (this.paginaActual - 1) * this.limitePorPagina;
    const fin = inicio + this.limitePorPagina;
    this.listaUsuariosMostrar = this.todosLosUsuariosFake.slice(inicio, fin);
  }

  siguientePagina() {
    if (this.paginaActual * this.limitePorPagina < this.totalUsuarios) {
      this.paginaActual++;
      this.cargarUsuariosSimulados();
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarUsuariosSimulados();
    }
  }

  async cargarUsuarios(url: string = '') {
    try {
      const response = await this.userService.getAllPromises(url);
      this.arrayUsersPromises.set(response.results);
    } catch (error) {}
  }
  cambiarEstado(usuarioId: number) {
    const user = this.todosLosUsuariosFake.find((u) => u.id === usuarioId);

    if (user) {
      user.status = user.status === 'Activo' ? 'Bloqueado' : 'Activo';
      this.cargarUsuariosSimulados();

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: user.status === 'Activo' ? 'success' : 'info',
        title: `Usuario ${user.username} ${user.status === 'Activo' ? 'desbloqueado' : 'bloqueado'}`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    }
  }

seleccionarUsuarioParaEditar(usuario: any) {
    this.usuariosSeleccionadosId = usuario.id;
    
    // El .patchValue() funciona EXACTAMENTE igual
    this.miFormularioEdicion.patchValue({
      username: usuario.username,
      apellido: usuario.apellido,
      email: usuario.email,
      role: usuario.role
    });
  }

  guardarCambiosUsuario() {
    if (this.miFormularioEdicion.invalid) {
      this.miFormularioEdicion.markAllAsTouched();
      return;
    }

    const datosEditados = this.miFormularioEdicion.value as IUserEditForm;

    const index = this.todosLosUsuariosFake.findIndex(u => u.id === this.usuariosSeleccionadosId);
    if (index !== -1) {
      this.todosLosUsuariosFake[index] = {
        ...this.todosLosUsuariosFake[index],
        username: datosEditados.username,
        apellido: datosEditados.apellido,
        email: datosEditados.email,
        role: datosEditados.role
      };

      this.usuariosSeleccionadosId = null;
      this.miFormularioEdicion.reset();
      this.cargarUsuariosSimulados();

      Swal.fire({
        icon: 'success',
        title: '¡Usuario Actualizado!',
        text: 'Los datos se modificaron correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  cancelarEdicion() {
    this.usuariosSeleccionadosId = null;
    this.miFormularioEdicion.reset();
  }
  

  eliminarUser(usuarioId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al usuario de la lista visual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.todosLosUsuariosFake = this.todosLosUsuariosFake.filter((u) => u.id !== usuarioId);
        this.totalUsuarios = this.todosLosUsuariosFake.length;

        const maxPaginas = Math.ceil(this.totalUsuarios / this.limitePorPagina);
        if (this.paginaActual > maxPaginas && this.paginaActual > 1) {
          this.paginaActual = maxPaginas;
        }

        this.cargarUsuariosSimulados();

        Swal.fire({
          title: '¡Eliminado!',
          text: 'El usuario ha sido removido con éxito.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }
}
