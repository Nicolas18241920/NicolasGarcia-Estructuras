import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-card card p-4">
      <h2>Iniciar sesión</h2>
      <input class="form-control mb-2" type="email" placeholder="Correo" [(ngModel)]="email" />
      <input class="form-control mb-2" type="password" placeholder="Contraseña" [(ngModel)]="password" />
      @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
      <button class="btn btn-primary w-100" (click)="enviar()">Entrar</button>
      <p class="mt-3 mb-0">¿No tienes cuenta? <a routerLink="/registro">Regístrate</a></p>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  error = signal('');

  async enviar() {
    try {
      await this.auth.entrar(this.email, this.password);
      this.router.navigate(['/tareas']);
    } catch {
      this.error.set('Correo o contraseña incorrectos');
    }
  }
}