import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Song } from '../../core/models/song.model';
import { CatalogService } from '../../core/services/catalog.service';

@Component({
  selector: 'app-related-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './related-panel.component.html',
  styleUrl: './related-panel.component.scss',
})
export class RelatedPanelComponent {
  protected readonly catalog = inject(CatalogService);

  protected readonly selected = this.catalog.selected;

  /** Vecinos directos en el grafo. */
  protected readonly related = computed(() => {
    const song = this.selected();
    return song ? this.catalog.relacionadas(song.id) : [];
  });

  /** Canciones a dos saltos ("también te puede gustar"). */
  protected readonly extended = computed(() => {
    const song = this.selected();
    return song ? this.catalog.extendidas(song.id) : [];
  });

  protected readonly adjacency = computed(() => this.catalog.adyacencia());

  protected select(song: Song): void {
    this.catalog.selectedId.set(song.id);
  }
}
