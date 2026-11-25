import { Grafo } from './graph';

const nodo = (id: string) => ({ id });

describe('Grafo (no dirigido)', () => {
  const crear = () => {
    const g = new Grafo<{ id: string }>();
    ['A', 'B', 'C', 'D'].forEach((id) => g.addNode(nodo(id)));
    g.addEdge('A', 'B');
    g.addEdge('B', 'C');
    return g;
  };

  it('las aristas van en ambos sentidos', () => {
    const g = crear();
    expect(g.neighbors('A').map((n) => n.id)).toEqual(['B']);
    expect(g.neighbors('B').map((n) => n.id)).toEqual(['A', 'C']);
  });

  it('no permite duplicar nodos ni aristas, ni lazos', () => {
    const g = crear();
    expect(g.addNode(nodo('A'))).toBe(false);
    expect(g.addEdge('B', 'A')).toBe(false);
    expect(g.addEdge('A', 'A')).toBe(false);
    expect(g.addEdge('A', 'Z')).toBe(false);
  });

  it('getEdges no repite pares', () => {
    expect(crear().getEdges()).toEqual([['A', 'B'], ['B', 'C']]);
  });

  it('distancesFrom calcula saltos con BFS', () => {
    const g = crear();
    const d = g.distancesFrom('A');
    expect(d.get('A')).toBe(0);
    expect(d.get('B')).toBe(1);
    expect(d.get('C')).toBe(2);
    expect(d.has('D')).toBe(false); // D está aislado
    expect(g.distancesFrom('A', 1).has('C')).toBe(false);
  });

  it('removeNode quita también sus aristas', () => {
    const g = crear();
    g.removeNode('B');
    expect(g.neighbors('A')).toEqual([]);
    expect(g.getEdges()).toEqual([]);
  });
});
