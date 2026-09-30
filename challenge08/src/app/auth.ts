import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuario = signal<string | null>(null);

  estaLogueado(): boolean {
    return this.usuario() !== null;
  }

  entrar(email: string, pass: string): boolean {
    if (email === 'user@mail.com' && pass === '123') {
      this.usuario.set(email);
      return true;
    }
    return false;
  }

  salir(): void {
    this.usuario.set(null);
  }
}