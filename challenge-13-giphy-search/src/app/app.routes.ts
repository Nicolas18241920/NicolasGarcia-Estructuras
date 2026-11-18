import { Routes } from '@angular/router';
import { GifSearchComponent } from './gif-search/gif-search';

export const routes: Routes = [
  { path: '', component: GifSearchComponent },
  { path: '**', redirectTo: '' }
];
