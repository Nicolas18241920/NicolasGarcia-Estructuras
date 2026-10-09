import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-card card p-4">
      <h2>Crear cuenta</h2>
      <input class="form-control mb-2" type="email" placeholder="Correo" [(ngModel)]="email" />
      <input class="form-control mb-2" type="password" placeholder="Contraseña (mínimo 6)" [(ngModel)]="password" />
      @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
      <button class="btn btn-success w-100" (click)="enviar()">Registrarme</button>
      <p class="mt-3 mb-0">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
    </div>
  `,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  error = signal('');

  async enviar() {
    try {
      await this.auth.registrar(this.email, this.password);
      this.router.navigate(['/tareas']);
    } catch {
      this.error.set('No se pudo registrar (correo en uso o contraseña muy corta)');
    }
  }
}