/** Devuelve > 0 si `a` tiene MÁS prioridad que `b`, < 0 si menos y 0 si empatan. */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Max Heap (montículo máximo) implementado desde cero sobre un arreglo.
 * Árbol binario completo: para el índice i, el padre es (i - 1) / 2
 * y los hijos son 2i + 1 y 2i + 2. La raíz siempre es el elemento de mayor prioridad.
 */
export class MaxHeap<T> {
  private readonly data: T[] = [];

  constructor(private readonly compare: Comparator<T>) {}

  /** Convierte un arreglo desordenado en heap en O(n). */
  static heapify<T>(items: readonly T[], compare: Comparator<T>): MaxHeap<T> {
    const heap = new MaxHeap<T>(compare);
    for (const item of items) heap.data.push(item);
    for (let i = (heap.data.length >> 1) - 1; i >= 0; i--) heap.percolateDown(i);
    return heap;
  }

  get size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  /** El elemento de mayor prioridad, sin sacarlo. */
  peek(): T | undefined {
    return this.data[0];
  }

  /** Inserta y reordena hacia arriba. */
  push(item: T): void {
    this.data.push(item);
    this.percolateUp(this.data.length - 1);
  }

  /** Saca el elemento de mayor prioridad y reordena hacia abajo. */
  pop(): T | undefined {
    if (this.isEmpty()) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.percolateDown(0);
    }
    return top;
  }

  /** Copia del arreglo interno (en orden de heap, no ordenado). */
  toArray(): T[] {
    return [...this.data];
  }

  private percolateUp(index: number): void {
    let i = index;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[parent]) <= 0) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  private percolateDown(index: number): void {
    let i = index;
    const n = this.data.length;
    for (;;) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.compare(this.data[left], this.data[largest]) > 0) largest = left;
      if (right < n && this.compare(this.data[right], this.data[largest]) > 0) largest = right;
      if (largest === i) return;
      this.swap(i, largest);
      i = largest;
    }
  }

  private swap(i: number, j: number): void {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  }
}
