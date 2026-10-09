import { Component, inject } from '@angular/core';
import { AuthService } from '../auth';

@Component({
  selector: 'app-ejercicio2',
  standalone: true,
  template: `
    <div style="padding: 2rem;">
      <h1>Página Privada - Ejercicio 2</h1>
      <p>Usuario actual: <strong>{{ auth.usuario() }}</strong></p>
    </div>
  `
})
export class Ejercicio2Component {
  protected auth = inject(AuthService);
}