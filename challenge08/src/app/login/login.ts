import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal<string | null>(null);

  entrar() {
    if (this.auth.entrar(this.email, this.password)) {
      this.error.set(null);
      this.router.navigate(['/ejercicio1']);
    } else {
      this.error.set('Credenciales incorrectas (Usa: user@mail.com / 123)');
    }
  }
}