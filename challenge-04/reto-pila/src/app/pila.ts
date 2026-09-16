export interface Libro {
  nombre: string;
  isbn: string;
  autor: string;
  editorial: string;
}

export class NodoLibro {
  public siguiente: NodoLibro | null = null;
  constructor(public libro: Libro) {}
}

export class PilaLibros {
  private tope: NodoLibro | null = null;

  push(libro: Libro): void {
    const nuevo = new NodoLibro(libro);
    nuevo.siguiente = this.tope;
    this.tope = nuevo;
  }

  pop(): Libro | null {
    if (!this.tope) return null;
    const eliminado = this.tope.libro;
    this.tope = this.tope.siguiente;
    return eliminado;
  }

  obtenerArreglo(): Libro[] {
    const arreglo: Libro[] = [];
    let actual = this.tope;
    while (actual) {
      arreglo.push(actual.libro);
      actual = actual.siguiente;
    }
    return arreglo;
  }
}