import { Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

const BUCKET = 'avatars';
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
  private readonly sb = inject(SupabaseService).client;

  protected readonly url = signal('');
  protected readonly error = signal('');
  protected readonly subiendo = signal(false);

  async ngOnInit(): Promise<void> {
    // Muestra el avatar más reciente del usuario, si ya subió alguno.
    const { data: { user } } = await this.sb.auth.getUser();
    if (!user) return;
    const { data } = await this.sb.storage
      .from(BUCKET)
      .list(user.id, { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });
    if (data?.length) this.url.set(this.urlPublica(`${user.id}/${data[0].name}`));
  }

  protected async subir(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error.set('Selecciona un archivo de imagen.');
      return;
    }
    if (file.size > MAX_BYTES) {
      this.error.set('La imagen no puede superar 2 MB.');
      return;
    }

    this.error.set('');
    this.subiendo.set(true);

    const { data: { user } } = await this.sb.auth.getUser();
    if (!user) {
      this.subiendo.set(false);
      return;
    }

    // La primera carpeta es el id del usuario: así lo exige la política de Storage.
    const ruta = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await this.sb.storage.from(BUCKET).upload(ruta, file, { upsert: true });

    this.subiendo.set(false);
    input.value = '';
    if (error) {
      this.error.set(error.message);
      return;
    }
    this.url.set(this.urlPublica(ruta));
  }

  private urlPublica(ruta: string): string {
    return this.sb.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
  }
}
