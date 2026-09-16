import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaSimplePacientes, ListaDobleHistorial, ListaCircularMedicos, ListaDobleCircularComite } from './models/estructuras';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  // Instanciamos nuestras 4 estructuras de datos
  pacientes = new ListaSimplePacientes();
  historial = new ListaDobleHistorial();
  medicos = new ListaCircularMedicos();
  comite = new ListaDobleCircularComite();

  // Variables para el formulario
  nuevoPacienteNombre = '';
  nuevoPacienteSintoma = '';

  ngOnInit() {
    // 1. Llenamos la lista circular de médicos
    this.medicos.agregar('Dr. House', 'Diagnóstico');
    this.medicos.agregar('Dra. Grey', 'Cirugía General');
    this.medicos.agregar('Dr. Shepherd', 'Neurocirugía');

    // 2. Llenamos la lista doble circular del comité
    this.comite.agregar('Ana Pérez', 'Directora Médica');
    this.comite.agregar('Luis Gómez', 'Jefe de Enfermería');
    this.comite.agregar('Carlos Ruiz', 'Administrador');

    // 3. Temporizador: Rota el turno del médico cada 10 segundos
    setInterval(() => {
      this.medicos.rotarTurno();
    }, 10000);
  }

  registrarPaciente() {
    if (this.nuevoPacienteNombre && this.nuevoPacienteSintoma) {
      this.pacientes.agregar(this.nuevoPacienteNombre, this.nuevoPacienteSintoma);
      this.nuevoPacienteNombre = ''; // Limpiamos el formulario
      this.nuevoPacienteSintoma = '';
    }
  }

  atenderSiguiente() {
    const atendido = this.pacientes.atender(); // Lo saca de la lista simple
    if (atendido) {
      this.historial.agregar(atendido.nombre, atendido.sintoma); // Lo mete a la lista doble
    } else {
      alert('No hay pacientes en espera.');
    }
  }
}