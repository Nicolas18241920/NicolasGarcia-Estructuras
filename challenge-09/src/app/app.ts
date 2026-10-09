import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected auth = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.auth.salir();
    this.router.navigate(['/login']);
  }
}