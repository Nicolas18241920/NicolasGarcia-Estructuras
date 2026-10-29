/** Todo nodo del grafo debe tener un identificador único. */
export interface NodoBase {
  id: string;
}

export interface GrafoJSON<N extends NodoBase> {
  nodos: N[];
  aristas: [string, string][];
}

/**
 * Grafo NO dirigido implementado desde cero (Clase 11):
 *  - una lista de nodos
 *  - un objeto de adyacencia: id -> ids de sus vecinos
 */
export class Grafo<N extends NodoBase> {
  private nodos: N[] = [];
  private adyacencia: Record<string, string[]> = {};

  /** Agrega un nodo. Devuelve false si ya existía uno con ese id. */
  addNode(nodo: N): boolean {
    if (this.searchNode(nodo.id)) return false;
    this.nodos.push(nodo);
    this.adyacencia[nodo.id] = [];
    return true;
  }

  /** Devuelve el nodo con ese id (o undefined). */
  searchNode(id: string): N | undefined {
    return this.nodos.find((n) => n.id === id);
  }

  /** Une dos nodos existentes. Devuelve false si no se pudo (mismo nodo, inexistente o repetida). */
  addEdge(a: string, b: string): boolean {
    if (a === b || !this.searchNode(a) || !this.searchNode(b)) return false;
    if (this.adyacencia[a].includes(b)) return false;
    this.adyacencia[a].push(b);
    this.adyacencia[b].push(a);
    return true;
  }

  /** Elimina un nodo y todas las aristas que lo tocan. */
  removeNode(id: string): boolean {
    if (!this.searchNode(id)) return false;
    for (const vecino of this.adyacencia[id]) {
      this.adyacencia[vecino] = this.adyacencia[vecino].filter((v) => v !== id);
    }
    delete this.adyacencia[id];
    this.nodos = this.nodos.filter((n) => n.id !== id);
    return true;
  }

  isEmpty(): boolean {
    return this.nodos.length === 0;
  }

  /** Nodos vecinos (conectados directamente) de un nodo. */
  neighbors(id: string): N[] {
    return (this.adyacencia[id] ?? []).map((v) => this.searchNode(v)).filter((n): n is N => !!n);
  }

  /** Texto con las aristas de un nodo: "A -> B, C". */
  printAdjacency(id: string, etiqueta: (n: N) => string = (n) => n.id): string {
    const nodo = this.searchNode(id);
    if (!nodo) return '';
    const vecinos = this.neighbors(id).map(etiqueta).join(', ');
    return `${etiqueta(nodo)} -> ${vecinos || '(sin conexiones)'}`;
  }

  /** Texto con todo el grafo, una línea por nodo. */
  print(etiqueta: (n: N) => string = (n) => n.id): string {
    return this.nodos.map((n) => this.printAdjacency(n.id, etiqueta)).join('\n');
  }

  getNodes(): readonly N[] {
    return this.nodos;
  }

  /** Aristas sin repetir (cada par aparece una sola vez). */
  getEdges(): [string, string][] {
    const aristas: [string, string][] = [];
    for (const nodo of this.nodos) {
      for (const vecino of this.adyacencia[nodo.id]) {
        if (nodo.id < vecino) aristas.push([nodo.id, vecino]);
      }
    }
    return aristas;
  }

  toJSON(): GrafoJSON<N> {
    return { nodos: this.nodos.map((n) => ({ ...n })), aristas: this.getEdges() };
  }

  static fromJSON<N extends NodoBase>(datos: GrafoJSON<N>): Grafo<N> {
    const grafo = new Grafo<N>();
    datos.nodos.forEach((n) => grafo.addNode({ ...n }));
    datos.aristas.forEach(([a, b]) => grafo.addEdge(a, b));
    return grafo;
  }
}
