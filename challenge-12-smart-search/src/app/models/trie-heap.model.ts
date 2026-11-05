export interface Product {
  id?: string;
  name: string;
  popularity: number;
}

// 1. Nodo del Trie
export class TrieNode {
  children: { [key: string]: TrieNode } = {};
  isEndOfWord: boolean = false;
  products: Product[] = [];
}

// 2. Estructura Trie para búsqueda rápida por prefijo
export class Trie {
  root: TrieNode = new TrieNode();

  insert(name: string, popularity: number) {
    let current = this.root;
    const lowerName = name.toLowerCase();

    for (const char of lowerName) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;

    // Actualiza o agrega el producto en el nodo final
    const existing = current.products.find(p => p.name.toLowerCase() === lowerName);
    if (existing) {
      existing.popularity = popularity;
    } else {
      current.products.push({ name, popularity });
    }
  }

  // Recorre el subárbol para obtener todas las coincidencias del prefijo
  getProductsByPrefix(prefix: string): Product[] {
    let current = this.root;
    const lowerPrefix = prefix.toLowerCase();

    for (const char of lowerPrefix) {
      if (!current.children[char]) {
        return [];
      }
      current = current.children[char];
    }

    const results: Product[] = [];
    this.collectAllProducts(current, results);
    return results;
  }

  private collectAllProducts(node: TrieNode, results: Product[]) {
    if (node.isEndOfWord) {
      results.push(...node.products);
    }
    for (const char in node.children) {
      this.collectAllProducts(node.children[char], results);
    }
  }
}

// 3. Estructura MaxHeap basada en arreglos para extraer los K más populares
export class MaxHeap {
  heap: Product[] = [];

  constructor(initial: Product[] = []) {
    if (initial.length > 0) {
      this.heap = [...initial];
      this.heapify();
    }
  }

  private swap(i: number, j: number) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  push(item: Product) {
    this.heap.push(item);
    this.percolateUp();
  }

  pop(): Product | undefined {
    if (this.heap.length === 0) return undefined;
    this.swap(0, this.heap.length - 1);
    const max = this.heap.pop();
    this.percolateDown(0);
    return max;
  }

  private percolateUp() {
    let curr = this.heap.length - 1;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (this.heap[curr].popularity > this.heap[parent].popularity) {
        this.swap(curr, parent);
        curr = parent;
      } else {
        break;
      }
    }
  }

  private percolateDown(index: number) {
    let curr = index;
    while (2 * curr + 1 < this.heap.length) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let maxChild = left;

      if (right < this.heap.length && this.heap[right].popularity > this.heap[left].popularity) {
        maxChild = right;
      }

      if (this.heap[maxChild].popularity > this.heap[curr].popularity) {
        this.swap(curr, maxChild);
        curr = maxChild;
      } else {
        break;
      }
    }
  }

  private heapify() {
    const start = Math.floor((this.heap.length - 2) / 2);
    for (let i = start; i >= 0; i--) {
      this.percolateDown(i);
    }
  }

  size(): number {
    return this.heap.length;
  }
}
