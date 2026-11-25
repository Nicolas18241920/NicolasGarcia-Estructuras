import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Song } from '../../core/models/song.model';
import { CatalogService } from '../../core/services/catalog.service';
import { Trie } from '../../core/structures/trie';

@Component({
  selector: 'app-search-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss',
})
export class SearchPanelComponent {
  protected readonly catalog = inject(CatalogService);

  protected readonly query = signal('');

  /** Sugerencias por prefijo desde el Trie. */
  protected readonly suggestions = computed(() => (this.query().trim() ? this.catalog.sugerencias(this.query(), 8) : []));

  /** ¿Existe una canción con exactamente ese título? */
  protected readonly exists = computed(() => this.catalog.existe(this.query()));

  /** Cuántas letras del título coinciden con lo escrito (para resaltarlas). */
  protected readonly matchLength = computed(() => Trie.normalize(this.query()).length);

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected select(song: Song): void {
    this.catalog.selectedId.set(song.id);
  }
}
