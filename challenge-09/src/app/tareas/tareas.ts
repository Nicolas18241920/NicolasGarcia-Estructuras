import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Tarea, TareasService } from '../tareas';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="tareas-page container">
      <h2 class="my-3">Mis tareas</h2>

      <div class="input-group mb-3">
        <input class="form-control" placeholder="Nueva tarea" [(ngModel)]="nuevoTitulo" (keyup.enter)="agregar()" />
        <button class="btn btn-primary" (click)="agregar()">Agregar</button>
      </div>

      <ul class="list-group">
        @for (t of tareas(); track t.id) {
          <li class="list-group-item tarea" [class.hecha]="t.hecha">
            <input type="checkbox" [checked]="t.hecha" (change)="alternar(t)" />
            @if (editandoId() === t.id) {
              <input class="form-control" [(ngModel)]="tituloEditado" (keyup.enter)="guardar(t)" />
              <button class="btn btn-sm btn-success" (click)="guardar(t)">Guardar</button>
            } @else {
              <span class="titulo">{{ t.titulo }}</span>
              <button class="btn btn-sm btn-secondary" (click)="editar(t)">Editar</button>
            }
            <button class="btn btn-sm btn-danger" (click)="eliminar(t)">Eliminar</button>
          </li>
        } @empty {
          <li class="list-group-item text-muted">Aún no tienes tareas.</li>
        }
      </ul>
    </div>
  `,
})
export class TareasComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private tareasService = inject(TareasService);

  tareas = signal<Tarea[]>([]);
  nuevoTitulo = '';
  editandoId = signal<string | null>(null);
  tituloEditado = '';
  private detener?: () => void;

  ngOnInit() {
    this.detener = this.tareasService.escuchar(this.auth.obtenerUid(), (lista) =>
      this.tareas.set(lista)
    );
  }

  ngOnDestroy() {
    this.detener?.();
  }

  async agregar() {
    const titulo = this.nuevoTitulo.trim();
    if (!titulo) return;
    await this.tareasService.agregar(titulo, this.auth.obtenerUid());
    this.nuevoTitulo = '';
  }

  alternar(t: Tarea) {
    this.tareasService.actualizar(t.id!, { hecha: !t.hecha });
  }

  editar(t: Tarea) {
    this.editandoId.set(t.id!);
    this.tituloEditado = t.titulo;
  }

  async guardar(t: Tarea) {
    const titulo = this.tituloEditado.trim();
    if (titulo) {
      await this.tareasService.actualizar(t.id!, { titulo });
    }
    this.editandoId.set(null);
  }

  eliminar(t: Tarea) {
    this.tareasService.eliminar(t.id!);
  }
}