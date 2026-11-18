import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GiphyService } from '../services/giphy.service';
import { GifItem } from '../models/giphy.model';

@Component({
  selector: 'app-gif-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gif-search.html'
})
export class GifSearchComponent implements OnInit {
  giphyService = inject(GiphyService);

  searchQuery: string = 'smile';
  limit: number = 25;
  offset: number = 0;
  rating: string = 'g';
  copiedId: string | null = null;

  quickTags: string[] = ['smile', 'coding', 'cats', 'angular', 'success', 'coffee'];

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.offset = 0;
    this.giphyService.searchGifs(this.searchQuery, this.limit, this.offset, this.rating);
  }

  selectTag(tag: string): void {
    this.searchQuery = tag;
    this.search();
  }

  nextPage(): void {
    this.offset += this.limit;
    this.giphyService.searchGifs(this.searchQuery, this.limit, this.offset, this.rating);
  }

  prevPage(): void {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.giphyService.searchGifs(this.searchQuery, this.limit, this.offset, this.rating);
    }
  }

  async copyGifUrl(gif: GifItem): Promise<void> {
    const url = gif.images.original.url;
    try {
      await navigator.clipboard.writeText(url);
      this.copiedId = gif.id;
      setTimeout(() => {
        if (this.copiedId === gif.id) {
          this.copiedId = null;
        }
      }, 2000);
    } catch {
      window.open(url, '_blank');
    }
  }
}
