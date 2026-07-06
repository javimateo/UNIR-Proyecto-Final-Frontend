import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private auth = inject(AuthService);

  private key = computed(() => `favs_${this.auth.currentUser()?.username || 'guest'}`);

  private idsSignal = signal<number[]>(this.read());

  ids = computed(() => this.idsSignal());

  private read(): number[] {
    if (typeof localStorage === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(this.key()) || '[]'); }
    catch { return []; }
  }

  private write(ids: number[]): void {
    localStorage.setItem(this.key(), JSON.stringify(ids));
  }

  isFavorite(id: number | undefined): boolean {
    return id !== undefined && this.idsSignal().includes(id);
  }

  // ponytail: demo seed for the empty localStorage case; replace with backend GET /favorites when API is ready
  seedIfEmpty(seed: number[]): void {
    if (this.idsSignal().length === 0) {
      this.idsSignal.set([...seed]);
      this.write(this.idsSignal());
    }
  }

  toggle(id: number | undefined): void {
    if (id === undefined) return;
    this.isFavorite(id) ? this.remove(id) : this.add(id);
  }

  add(id: number): void {
    const next = this.idsSignal();
    if (next.includes(id)) return;
    this.idsSignal.set([...next, id]);
    this.write(this.idsSignal());
    this.toast('Añadido a favoritos');
  }

  remove(id: number): void {
    this.idsSignal.set(this.idsSignal().filter(x => x !== id));
    this.write(this.idsSignal());
    this.toast('Eliminado de favoritos');
  }

  private toast(title: string): void {
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title, showConfirmButton: false, timer: 1500 });
  }
}
