export class Estructuras {}
// --- 1. LISTA ENLAZADA SIMPLE (Gestión de pacientes en espera) ---
export class NodoPaciente {
  nombre: string;
  sintoma: string;
  siguiente: NodoPaciente | null = null;

  constructor(nombre: string, sintoma: string) {
    this.nombre = nombre;
    this.sintoma = sintoma;
  }
}

export class ListaSimplePacientes {
  cabeza: NodoPaciente | null = null;

  agregar(nombre: string, sintoma: string) {
    const nuevoNodo = new NodoPaciente(nombre, sintoma);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
    } else {
      let actual = this.cabeza;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevoNodo;
    }
  }

  // Atiende al primer paciente de la fila (Lo elimina de la lista simple)
  atender(): NodoPaciente | null {
    if (!this.cabeza) return null;
    const atendido = this.cabeza;
    this.cabeza = this.cabeza.siguiente; 
    return atendido;
  }

  // Método auxiliar para mostrar los pacientes en Angular fácilmente
  obtenerArreglo(): NodoPaciente[] {
    const pacientes: NodoPaciente[] = [];
    let actual = this.cabeza;
    while (actual) {
      pacientes.push(actual);
      actual = actual.siguiente;
    }
    return pacientes;
  }
}

// --- 2. LISTA DOBLEMENTE ENLAZADA (Historial de atención) ---
export class NodoHistorial {
  nombre: string;
  sintoma: string;
  fechaAtencion: Date;
  siguiente: NodoHistorial | null = null;
  anterior: NodoHistorial | null = null;

  constructor(nombre: string, sintoma: string) {
    this.nombre = nombre;
    this.sintoma = sintoma;
    this.fechaAtencion = new Date();
  }
}

export class ListaDobleHistorial {
  cabeza: NodoHistorial | null = null;
  cola: NodoHistorial | null = null;

  agregar(nombre: string, sintoma: string) {
    const nuevoNodo = new NodoHistorial(nombre, sintoma);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
      this.cola = nuevoNodo;
    } else {
      if (this.cola) {
        this.cola.siguiente = nuevoNodo;
        nuevoNodo.anterior = this.cola;
        this.cola = nuevoNodo;
      }
    }
  }

  obtenerArreglo(): NodoHistorial[] {
    const historial: NodoHistorial[] = [];
    let actual = this.cabeza;
    while (actual) {
      historial.push(actual);
      actual = actual.siguiente;
    }
    return historial;
  }
}

// --- 3. LISTA CIRCULAR (Rotación automática de médicos) ---
export class NodoMedico {
  nombre: string;
  especialidad: string;
  siguiente: NodoMedico | null = null;

  constructor(nombre: string, especialidad: string) {
    this.nombre = nombre;
    this.especialidad = especialidad;
  }
}

export class ListaCircularMedicos {
  cabeza: NodoMedico | null = null;
  cola: NodoMedico | null = null;
  medicoDeTurno: NodoMedico | null = null;

  agregar(nombre: string, especialidad: string) {
    const nuevoNodo = new NodoMedico(nombre, especialidad);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
      this.cola = nuevoNodo;
      nuevoNodo.siguiente = this.cabeza;
      this.medicoDeTurno = this.cabeza;
    } else {
      if (this.cola) {
        this.cola.siguiente = nuevoNodo;
        this.cola = nuevoNodo;
        this.cola.siguiente = this.cabeza; // Aquí cerramos el círculo
      }
    }
  }

  // Avanza al siguiente médico (lo usaremos con el temporizador de 10 seg)
  rotarTurno() {
    if (this.medicoDeTurno && this.medicoDeTurno.siguiente) {
      this.medicoDeTurno = this.medicoDeTurno.siguiente;
    }
  }

  obtenerArreglo(): NodoMedico[] {
    if (!this.cabeza) return [];
    const medicos: NodoMedico[] = [];
    let actual = this.cabeza;
    do {
      medicos.push(actual);
      actual = actual.siguiente!;
    } while (actual !== this.cabeza);
    return medicos;
  }
}

// --- 4. LISTA CIRCULAR DOBLEMENTE ENLAZADA (Comité Administrativo) ---
export class NodoComite {
  nombre: string;
  cargo: string;
  siguiente: NodoComite | null = null;
  anterior: NodoComite | null = null;

  constructor(nombre: string, cargo: string) {
    this.nombre = nombre;
    this.cargo = cargo;
  }
}

export class ListaDobleCircularComite {
  cabeza: NodoComite | null = null;
  cola: NodoComite | null = null;

  agregar(nombre: string, cargo: string) {
    const nuevoNodo = new NodoComite(nombre, cargo);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
      this.cola = nuevoNodo;
      nuevoNodo.siguiente = this.cabeza;
      nuevoNodo.anterior = this.cola;
    } else {
      if (this.cola && this.cabeza) {
        this.cola.siguiente = nuevoNodo;
        nuevoNodo.anterior = this.cola;
        nuevoNodo.siguiente = this.cabeza;
        this.cabeza.anterior = nuevoNodo;
        this.cola = nuevoNodo; // Cierra el círculo doble
      }
    }
  }

  obtenerArreglo(): NodoComite[] {
    if (!this.cabeza) return [];
    const comite: NodoComite[] = [];
    let actual = this.cabeza;
    do {
      comite.push(actual);
      actual = actual.siguiente!;
    } while (actual !== this.cabeza);
    return comite;
  }
}