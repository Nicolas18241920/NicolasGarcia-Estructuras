import { Component } from '@angular/core';
import { AddSongPanelComponent } from './features/add-song/add-song-panel.component';
import { RankingPanelComponent } from './features/ranking/ranking-panel.component';
import { RelatedPanelComponent } from './features/related/related-panel.component';
import { SearchPanelComponent } from './features/search/search-panel.component';

@Component({
  selector: 'app-root',
  imports: [SearchPanelComponent, RankingPanelComponent, RelatedPanelComponent, AddSongPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
