import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ItemService } from '../../service/item.service';
import { IItem } from '../../interface/iitem.interface';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import Swal from 'sweetalert2';

interface Message {
  sender: 'me' | 'other';
  text: string;
  time: string;
}

interface Chat {
  id: number;
  userName: string;
  itemTitle: string;
  itemImage: string;
  lastMessage: string;
  unread: boolean;
  messages: Message[];
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ItemCardComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private itemService = inject(ItemService);
  private router = inject(Router);

  activeTab: 'anuncios' | 'favoritos' | 'mensajes' | 'perfil' = 'anuncios';

  // Mis anuncios y favoritos
  myItems: IItem[] = [];
  favoriteItems: IItem[] = [];
  isLoadingItems: boolean = false;

  // Formulario Perfil
  profileForm!: FormGroup;

  // Chats / Mensajería
  chats: Chat[] = [
    {
      id: 1,
      userName: 'Carlos Gómez',
      itemTitle: 'iPhone 13 Pro',
      itemImage: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=100',
      lastMessage: '¿Aceptas 500€ y lo recojo hoy mismo?',
      unread: true,
      messages: [
        { sender: 'other', text: 'Hola Jonathan, ¿sigue disponible el iPhone 13 Pro?', time: 'Ayer, 18:30' },
        { sender: 'me', text: 'Hola Carlos, sí, sigue disponible.', time: 'Ayer, 18:45' },
        { sender: 'other', text: '¿Aceptas 500€ y lo recojo hoy mismo?', time: 'Hoy, 09:12' }
      ]
    },
    {
      id: 2,
      userName: 'Lucía Fernández',
      itemTitle: 'Chaqueta de cuero vintage',
      itemImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100',
      lastMessage: 'Me queda perfecta, ¡gracias por todo!',
      unread: false,
      messages: [
        { sender: 'other', text: 'Hola, ¿qué medidas tiene de hombro a hombro?', time: 'Hace 3 días' },
        { sender: 'me', text: 'Hola Lucía. Mide exactamente 46 cm de hombros.', time: 'Hace 3 días' },
        { sender: 'other', text: 'Genial. Me la quedo entonces.', time: 'Hace 2 días' },
        { sender: 'other', text: 'Me queda perfecta, ¡gracias por todo!', time: 'Ayer, 12:15' }
      ]
    }
  ];

  selectedChat: Chat | null = null;
  newMessageText: string = '';

  ngOnInit(): void {
    // Redirigir al login si el usuario no está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.initializeProfileForm();
    this.loadMyItems();
    this.loadFavorites();
  }

  // Cargar mis anuncios (simulados o reales)
  async loadMyItems(): Promise<void> {
    this.isLoadingItems = true;
    try {
      const currentUser = this.authService.currentUser();
      // Filtrar anuncios por el ID de nuestro usuario logueado (por defecto user_id: 1 en auth.service para Jonathan)
      const userId = currentUser?.id || 1;
      
      const response = await this.itemService.getAll({ per_page: 50 });
      // En modo simulado, algunos anuncios de mockItems tienen user_id: 1 (Ana).
      // Para simular los de Jonathan, tomamos aquellos que tengan el ID del usuario actual o simulados.
      this.myItems = response.results.filter(item => item.user_id === userId || item.user?.username === currentUser?.username);
    } catch (error) {
      console.error('Error al cargar mis anuncios', error);
    } finally {
      this.isLoadingItems = false;
    }
  }

  // Inicializar/Cargar Favoritos desde localStorage
  async loadFavorites(): Promise<void> {
    try {
      const currentUser = this.authService.currentUser();
      const favKey = `favs_${currentUser?.username || 'global'}`;
      const savedFavs: number[] = JSON.parse(localStorage.getItem(favKey) || '[]');
      
      // Si está vacío, por defecto simular un par para que la vista no se vea vacía e impresione
      if (savedFavs.length === 0) {
        const defaultFavs = [2, 4]; // Bicicleta de montaña (2) y Cafetera Express (4)
        localStorage.setItem(favKey, JSON.stringify(defaultFavs));
        savedFavs.push(...defaultFavs);
      }

      const response = await this.itemService.getAll({ per_page: 50 });
      this.favoriteItems = response.results.filter(item => item.id && savedFavs.includes(item.id));
    } catch (error) {
      console.error('Error al cargar favoritos', error);
    }
  }

  // Quitar de favoritos
  removeFavorite(itemId: number): void {
    const currentUser = this.authService.currentUser();
    const favKey = `favs_${currentUser?.username || 'global'}`;
    let savedFavs: number[] = JSON.parse(localStorage.getItem(favKey) || '[]');
    
    savedFavs = savedFavs.filter(id => id !== itemId);
    localStorage.setItem(favKey, JSON.stringify(savedFavs));
    this.favoriteItems = this.favoriteItems.filter(item => item.id !== itemId);
    
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Eliminado de favoritos',
      showConfirmButton: false,
      timer: 1500
    });
  }

  // Inicializar formulario de Perfil
  initializeProfileForm(): void {
    const user = this.authService.currentUser();
    this.profileForm = new FormGroup({
      username: new FormControl(user?.username || '', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl(user?.apellido || '', [Validators.required, Validators.minLength(3)]),
      email: new FormControl(user?.email || '', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.minLength(8)])
    });
  }

  // Guardar datos del Perfil
  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedUser = {
        ...this.authService.currentUser(),
        username: this.profileForm.value.username,
        apellido: this.profileForm.value.apellido,
        email: this.profileForm.value.email
      };
      
      this.authService.setCurrentUser(updatedUser);
      
      Swal.fire({
        title: '¡Perfil Actualizado!',
        text: 'Los cambios se han guardado con éxito.',
        icon: 'success',
        confirmButtonColor: '#198754'
      });
      
      // Reiniciar password
      this.profileForm.get('password')?.setValue('');
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  // Cambiar pestaña
  setTab(tab: 'anuncios' | 'favoritos' | 'mensajes' | 'perfil'): void {
    this.activeTab = tab;
    this.selectedChat = null; // resetear chat al cambiar
  }

  // Seleccionar una conversación
  selectChat(chat: Chat): void {
    this.selectedChat = chat;
    chat.unread = false;
  }

  // Enviar mensaje en el chat
  sendMessage(): void {
    if (!this.newMessageText.trim() || !this.selectedChat) return;

    // Mensaje del usuario
    const myMsg: Message = {
      sender: 'me',
      text: this.newMessageText,
      time: 'Hace un momento'
    };

    this.selectedChat.messages.push(myMsg);
    this.selectedChat.lastMessage = this.newMessageText;
    const sentText = this.newMessageText;
    this.newMessageText = '';

    // Auto-respuesta simulada para que se vea interactivo
    setTimeout(() => {
      if (this.selectedChat) {
        const replyMsg: Message = {
          sender: 'other',
          text: `Entendido. Gracias por responder a: "${sentText}". Lo reviso y te comento.`,
          time: 'Hace un momento'
        };
        this.selectedChat.messages.push(replyMsg);
        this.selectedChat.lastMessage = replyMsg.text;
      }
    }, 1500);
  }

  // Eliminar un anuncio propio
  async deleteItem(itemId: number): Promise<void> {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto. El anuncio será eliminado permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // En modo simulación eliminamos de la lista local
        this.myItems = this.myItems.filter(item => item.id !== itemId);
        // Si queremos actualizar el itemService mockItems deberíamos implementar delete o hacerlo de manera local
        Swal.fire(
          '¡Eliminado!',
          'Tu anuncio ha sido eliminado.',
          'success'
        );
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el anuncio', 'error');
      }
    }
  }
}
