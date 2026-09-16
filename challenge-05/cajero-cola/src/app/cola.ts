export interface Persona {
  nombre: string;
  montoRetiro: number;
  fechaLlegada: Date;
}

export class NodoPersona {
  public siguiente: NodoPersona | null = null;
  constructor(public persona: Persona) {}
}

export class ColaPersonas {
  private frente: NodoPersona | null = null;
  private final: NodoPersona | null = null;

  // FIFO: Insertar al final de la cola
  enqueue(persona: Persona): void {
    const nuevo = new NodoPersona(persona);
    if (!this.final) {
      this.frente = nuevo;
      this.final = nuevo;
    } else {
      this.final.siguiente = nuevo;
      this.final = nuevo;
    }
  }

  // FIFO: Atender/Sacar del frente de la cola
  dequeue(): Persona | null {
    if (!this.frente) return null;
    const atendido = this.frente.persona;
    this.frente = this.frente.siguiente;
    if (!this.frente) {
      this.final = null;
    }
    return atendido;
  }

  obtenerArreglo(): Persona[] {
    const arreglo: Persona[] = [];
    let actual = this.frente;
    while (actual) {
      arreglo.push(actual.persona);
      actual = actual.siguiente;
    }
    return arreglo;
  }
}