import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Tarea } from '../../models/tarea.model';
import { SupabaseService } from '../../services/supabase.service';
import { TareasService } from '../../services/tareas.service';

@Component({
  selector: 'app-tareas',
  imports: [FormsModule],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.scss',
})
export class TareasComponent implements OnInit, OnDestroy {
  protected readonly srv = inject(TareasService);
  private readonly sb = inject(SupabaseService).client;
  private canal?: RealtimeChannel;

  protected readonly tareas = signal<Tarea[]>([]);
  protected readonly error = signal('');
  protected nueva = '';

  async ngOnInit(): Promise<void> {
    await this.cargar();
    // Lista en vivo: cualquier cambio en la tabla vuelve a cargar la lista.
    this.canal = this.srv.escuchar(() => void this.cargar());
  }

  protected async cargar(): Promise<void> {
    const { data, error } = await this.srv.listar();
    if (error) this.error.set(error.message);
    else this.tareas.set((data ?? []) as Tarea[]);
  }

  protected async agregar(): Promise<void> {
    const titulo = this.nueva.trim();
    if (!titulo) return;
    const { error } = await this.srv.crear(titulo);
    this.error.set(error?.message ?? '');
    if (!error) this.nueva = '';
  }

  protected async completar(t: Tarea): Promise<void> {
    const { error } = await this.srv.completar(t.id, !t.completada);
    if (error) this.error.set(error.message);
  }

  protected async borrar(t: Tarea): Promise<void> {
    const { error } = await this.srv.borrar(t.id);
    if (error) this.error.set(error.message);
  }

  ngOnDestroy(): void {
    if (this.canal) this.sb.removeChannel(this.canal);
  }
}
