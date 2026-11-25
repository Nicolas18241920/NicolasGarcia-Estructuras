export interface GraphNode {
  id: string;
}

/**
 * Grafo NO dirigido implementado desde cero:
 *  - una lista de nodos
 *  - un objeto de adyacencia: id -> ids de sus vecinos
 * Si A es vecino de B, entonces B es vecino de A.
 */
export class Grafo<N extends GraphNode> {
  private nodes: N[] = [];
  private adjacency: Record<string, string[]> = {};

  /** Agrega un nodo. Devuelve false si ya existía uno con ese id. */
  addNode(node: N): boolean {
    if (this.searchNode(node.id)) return false;
    this.nodes.push(node);
    this.adjacency[node.id] = [];
    return true;
  }

  searchNode(id: string): N | undefined {
    return this.nodes.find((n) => n.id === id);
  }

  /** Une dos nodos existentes. Devuelve false si no se pudo (mismo nodo, inexistente o ya unidos). */
  addEdge(a: string, b: string): boolean {
    if (a === b || !this.searchNode(a) || !this.searchNode(b)) return false;
    if (this.adjacency[a].includes(b)) return false;
    this.adjacency[a].push(b);
    this.adjacency[b].push(a);
    return true;
  }

  removeNode(id: string): boolean {
    if (!this.searchNode(id)) return false;
    for (const neighbor of this.adjacency[id]) {
      this.adjacency[neighbor] = this.adjacency[neighbor].filter((v) => v !== id);
    }
    delete this.adjacency[id];
    this.nodes = this.nodes.filter((n) => n.id !== id);
    return true;
  }

  isEmpty(): boolean {
    return this.nodes.length === 0;
  }

  getNodes(): readonly N[] {
    return this.nodes;
  }

  /** Nodos conectados directamente con `id`. */
  neighbors(id: string): N[] {
    return (this.adjacency[id] ?? []).map((v) => this.searchNode(v)).filter((n): n is N => !!n);
  }

  /** Aristas sin repetir (cada par aparece una sola vez). */
  getEdges(): [string, string][] {
    const edges: [string, string][] = [];
    for (const node of this.nodes) {
      for (const neighbor of this.adjacency[node.id]) {
        if (node.id < neighbor) edges.push([node.id, neighbor]);
      }
    }
    return edges;
  }

  /**
   * Recorrido en anchura (BFS): distancia en aristas desde `id` a cada nodo alcanzable,
   * sin pasar de `maxDepth`. Incluye el nodo de partida con distancia 0.
   */
  distancesFrom(id: string, maxDepth = Infinity): Map<string, number> {
    const distances = new Map<string, number>();
    if (!this.searchNode(id)) return distances;

    distances.set(id, 0);
    const queue = [id];
    for (let head = 0; head < queue.length; head++) {
      const current = queue[head];
      const depth = distances.get(current)!;
      if (depth >= maxDepth) continue;
      for (const neighbor of this.adjacency[current]) {
        if (!distances.has(neighbor)) {
          distances.set(neighbor, depth + 1);
          queue.push(neighbor);
        }
      }
    }
    return distances;
  }

  /** Texto con la lista de adyacencia: una línea por nodo ("A -> B, C"). */
  print(label: (n: N) => string = (n) => n.id): string {
    return this.nodes
      .map((n) => {
        const neighbors = this.neighbors(n.id).map(label).join(', ');
        return `${label(n)} -> ${neighbors || '(sin conexiones)'}`;
      })
      .join('\n');
  }
}
