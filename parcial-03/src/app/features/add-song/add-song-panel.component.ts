import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Genre, GENRES } from '../../core/models/song.model';
import { CatalogService } from '../../core/services/catalog.service';

@Component({
  selector: 'app-add-song-panel',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-song-panel.component.html',
  styleUrl: './add-song-panel.component.scss',
})
export class AddSongPanelComponent {
  protected readonly catalog = inject(CatalogService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly genres = GENRES;
  protected readonly similares = signal<string[]>([]);
  protected readonly error = signal('');
  protected readonly ok = signal('');

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    artist: ['', [Validators.required, Validators.maxLength(60)]],
    genre: ['pop' as Genre, Validators.required],
    plays: [0, [Validators.required, Validators.min(0)]],
  });

  protected toggleSimilar(id: string, checked: boolean): void {
    this.similares.update((ids) => (checked ? [...ids, id] : ids.filter((x) => x !== id)));
  }

  protected submit(): void {
    this.error.set('');
    this.ok.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    try {
      const song = this.catalog.agregarCancion({ ...this.form.getRawValue(), similares: this.similares() });
      this.catalog.selectedId.set(song.id);
      this.ok.set(`Se agregó «${song.title}».`);
      this.form.reset({ title: '', artist: '', genre: 'pop', plays: 0 });
      this.similares.set([]);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'No se pudo agregar la canción.');
    }
  }
}
