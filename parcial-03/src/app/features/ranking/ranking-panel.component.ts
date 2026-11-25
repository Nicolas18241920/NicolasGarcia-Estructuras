import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Song } from '../../core/models/song.model';
import { CatalogService, PLAY_STEP } from '../../core/services/catalog.service';

@Component({
  selector: 'app-ranking-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ranking-panel.component.html',
  styleUrl: './ranking-panel.component.scss',
})
export class RankingPanelComponent {
  private readonly catalog = inject(CatalogService);

  protected readonly options = [5, 10] as const;
  protected readonly topN = signal<number>(5);
  protected readonly playStep = PLAY_STEP;

  /** TOP N más escuchadas, salido del Max Heap. */
  protected readonly ranking = computed(() => this.catalog.ranking(this.topN()));
  private readonly maxPlays = computed(() => this.ranking()[0]?.plays ?? 1);

  private readonly formatter = new Intl.NumberFormat('es', { notation: 'compact' });

  protected percent(song: Song): number {
    return Math.round((song.plays / this.maxPlays()) * 100);
  }

  protected compact(plays: number): string {
    return this.formatter.format(plays);
  }

  protected play(song: Song): void {
    this.catalog.reproducir(song.id);
  }

  protected select(song: Song): void {
    this.catalog.selectedId.set(song.id);
  }
}
