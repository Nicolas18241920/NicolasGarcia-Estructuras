import { inject, Injectable } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class TareasService {
  private readonly sb = inject(SupabaseService).client;

  /** READ: las más recientes primero (RLS filtra solo las del usuario). */
  listar() {
    return this.sb.from('tareas').select('*').order('created_at', { ascending: false });
  }

  /** CREATE: user_id se llena solo con default auth.uid(). */
  crear(titulo: string) {
    return this.sb.from('tareas').insert({ titulo });
  }

  /** UPDATE */
  completar(id: number, valor: boolean) {
    return this.sb.from('tareas').update({ completada: valor }).eq('id', id);
  }

  /** DELETE */
  borrar(id: number) {
    return this.sb.from('tareas').delete().eq('id', id);
  }

  /** Realtime: avisa ante cualquier INSERT/UPDATE/DELETE en la tabla. */
  escuchar(alCambiar: () => void): RealtimeChannel {
    return this.sb
      .channel('tareas-ng')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, alCambiar)
      .subscribe();
  }
}
