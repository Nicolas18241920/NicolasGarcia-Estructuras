import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected email = '';
  protected clave = '';
  protected readonly msg = signal('');
  protected readonly esError = signal(false);
  protected readonly ocupado = signal(false);

  protected async entrar(): Promise<void> {
    this.ocupado.set(true);
    const { error } = await this.auth.entrar(this.email, this.clave);
    this.ocupado.set(false);
    if (error) {
      this.mostrar(error.message, true);
    } else {
      await this.router.navigate(['/tareas']);
    }
  }

  protected async registrar(): Promise<void> {
    this.ocupado.set(true);
    const { data, error } = await this.auth.registrar(this.email, this.clave);
    this.ocupado.set(false);
    if (error) {
      this.mostrar(error.message, true);
    } else if (data.session) {
      // Confirmación de correo desactivada: ya hay sesión.
      await this.router.navigate(['/tareas']);
    } else {
      this.mostrar('Cuenta creada. Revisa tu correo para confirmarla.', false);
    }
  }

  private mostrar(texto: string, error: boolean): void {
    this.msg.set(texto);
    this.esError.set(error);
  }
}
