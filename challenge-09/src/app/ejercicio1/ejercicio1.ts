import { Component, inject } from '@angular/core';
import { AuthService } from '../auth';

@Component({
  selector: 'app-ejercicio1',
  standalone: true,
  template: `
    <div style="padding: 2rem;">
      <h1>Página Privada - Ejercicio 1</h1>
      <p>Bienvenido, <strong>{{ auth.usuario() }}</strong>!</p>
    </div>
  `
})
export class Ejercicio1Component {
  protected auth = inject(AuthService);
}