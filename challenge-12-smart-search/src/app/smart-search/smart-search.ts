import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { AuthService } from '../auth.service';
import { Product } from '../models/trie-heap.model';

@Component({
  selector: 'app-smart-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './smart-search.html'
})
export class SmartSearchComponent implements OnInit {
  searchQuery: string = '';
  topKCount: number = 2;
  results: Product[] = [];

  // Formulario para ingresar nuevos productos
  newProductName: string = '';
  newProductPopularity: number = 80;
  userEmail: string = '';

  constructor(
    private searchService: SearchService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.userEmail = user.email || 'Usuario';
    await this.searchService.loadProducts();
  }

  onSearchChange() {
    this.results = this.searchService.searchTopK(this.searchQuery, this.topKCount);
  }

  async addProduct() {
    if (!this.newProductName.trim()) return;

    await this.searchService.addProduct(
      this.newProductName.trim(),
      Number(this.newProductPopularity)
    );

    this.newProductName = '';
    this.onSearchChange();
    alert('¡Producto agregado al Trie y a la base de datos!');
  }

  // Carga los datos de ejemplo solicitados en el Challenge 12
  async loadSlideExamples() {
    const examples = [
      { name: 'air max', popularity: 90 },
      { name: 'air force', popularity: 95 },
      { name: 'air jordan', popularity: 85 },
      { name: 'adidas boost', popularity: 80 }
    ];

    for (const item of examples) {
      await this.searchService.addProduct(item.name, item.popularity);
    }

    this.searchQuery = 'air';
    this.onSearchChange();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
