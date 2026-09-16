import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColaPersonas } from './cola';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  cola = new ColaPersonas();

  nuevoNombre = '';
  nuevoMonto: number | null = null;

  ngOnInit() {
    // Carga de Datos de Prueba (Mock Data) con horas aleatorias
    this.cola.enqueue({
      nombre: 'Carlos Mendoza',
      montoRetiro: 150000,
      fechaLlegada: this.generarFechaAleatoria(30)
    });
    this.cola.enqueue({
      nombre: 'Ana Sofía Ruiz',
      montoRetiro: 300000,
      fechaLlegada: this.generarFechaAleatoria(15)
    });
    this.cola.enqueue({
      nombre: 'David Guerrero',
      montoRetiro: 50000,
      fechaLlegada: this.generarFechaAleatoria(5)
    });
  }

  generarFechaAleatoria(minutosAtrasMax: number): Date {
    const ahora = new Date();
    const minutosAleatorios = Math.floor(Math.random() * minutosAtrasMax);
    return new Date(ahora.getTime() - minutosAleatorios * 60000);
  }

  encolarPersona() {
    if (this.nuevoNombre && this.nuevoMonto && this.nuevoMonto > 0) {
      this.cola.enqueue({
        nombre: this.nuevoNombre,
        montoRetiro: this.nuevoMonto,
        fechaLlegada: this.generarFechaAleatoria(2) // Asigna fecha/hora de llegada
      });
      this.nuevoNombre = '';
      this.nuevoMonto = null;
    } else {
      alert('Por favor ingrese un nombre y un monto de retiro válido.');
    }
  }

  atenderPersona() {
    const atendido = this.cola.dequeue();
    if (atendido) {
      alert(`🏧 Atendiendo en Cajero a: ${atendido.nombre}\nMonto retirado: $${atendido.montoRetiro.toLocaleString('es-CO')}`);
    } else {
      alert('La fila del cajero está vacía.');
    }
  }
}