import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PilaLibros } from './pila';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  pila = new PilaLibros();

  nuevoNombre = '';
  nuevoIsbn = '';
  nuevoAutor = '';
  nuevaEditorial = '';

  ngOnInit() {
    this.pila.push({
      nombre: 'Cien años de soledad',
      isbn: '978-0307474728',
      autor: 'Gabriel García Márquez',
      editorial: 'Sudamericana'
    });
    this.pila.push({
      nombre: 'El Principito',
      isbn: '978-0156013987',
      autor: 'Antoine de Saint-Exupéry',
      editorial: 'Reynal & Hitchcock'
    });
  }

  agregarLibro() {
    if (this.nuevoNombre && this.nuevoIsbn && this.nuevoAutor && this.nuevaEditorial) {
      this.pila.push({
        nombre: this.nuevoNombre,
        isbn: this.nuevoIsbn,
        autor: this.nuevoAutor,
        editorial: this.nuevaEditorial
      });
      this.nuevoNombre = '';
      this.nuevoIsbn = '';
      this.nuevoAutor = '';
      this.nuevaEditorial = '';
    } else {
      alert('Por favor completa todos los campos.');
    }
  }

  desapilar() {
    const sacado = this.pila.pop();
    if (!sacado) {
      alert('La pila está vacía.');
    }
  }
}