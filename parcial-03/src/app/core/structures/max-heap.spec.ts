import { MaxHeap } from './max-heap';

const numeros = (a: number, b: number) => a - b;

describe('MaxHeap', () => {
  it('push mantiene el mayor en la raíz', () => {
    const heap = new MaxHeap<number>(numeros);
    [5, 1, 9, 3, 7].forEach((n) => heap.push(n));
    expect(heap.peek()).toBe(9);
    expect(heap.size).toBe(5);
  });

  it('pop devuelve los elementos de mayor a menor', () => {
    const heap = new MaxHeap<number>(numeros);
    [5, 1, 9, 3, 7, 7, 2].forEach((n) => heap.push(n));
    const salida: number[] = [];
    while (!heap.isEmpty()) salida.push(heap.pop()!);
    expect(salida).toEqual([9, 7, 7, 5, 3, 2, 1]);
  });

  it('heapify convierte un arreglo desordenado en heap', () => {
    const heap = MaxHeap.heapify([4, 10, 3, 5, 1], numeros);
    expect(heap.peek()).toBe(10);
    const arr = heap.toArray();
    // propiedad de heap: cada padre >= sus hijos
    for (let i = 1; i < arr.length; i++) expect(arr[(i - 1) >> 1] >= arr[i]).toBe(true);
  });

  it('pop y peek en un heap vacío devuelven undefined', () => {
    const heap = new MaxHeap<number>(numeros);
    expect(heap.pop()).toBe(undefined);
    expect(heap.peek()).toBe(undefined);
  });
});
