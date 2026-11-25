import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  const crear = () => new CatalogService();

  it('el ranking sale ordenado por reproducciones', () => {
    const top = crear().ranking(3).map((s) => s.title);
    expect(top).toEqual(['Despacito', 'Blinding Lights', 'Shape of You']);
  });

  it('reproducir cambia el ranking', () => {
    const c = crear();
    const bohemian = c.buscarPorTitulo('Bohemian Rhapsody')!;
    for (let i = 0; i < 10; i++) c.reproducir(bohemian.id);
    expect(c.ranking(1)[0].title).toBe('Bohemian Rhapsody');
  });

  it('sugiere por prefijo y confirma existencia', () => {
    const c = crear();
    expect(c.sugerencias('th').map((s) => s.title)).toEqual(['Thunder', 'Thunderstruck']);
    expect(c.existe('shallow')).toBe(true);
    expect(c.existe('Shall')).toBe(false);
  });

  it('las canciones relacionadas salen del grafo', () => {
    const c = crear();
    const shallow = c.buscarPorTitulo('Shallow')!;
    const nombres = c.relacionadas(shallow.id).map((s) => s.title);
    expect(nombres).toEqual(['Shape of You', 'Someone You Loved']);
  });

  it('extendidas devuelve canciones a dos saltos que no son vecinas', () => {
    const c = crear();
    const camisa = c.buscarPorTitulo('La Camisa Negra')!;
    expect(c.extendidas(camisa.id)).toEqual([]); // su grupo ya es un triángulo completo
    const thunder = c.buscarPorTitulo('Thunder')!;
    expect(c.extendidas(thunder.id).map((s) => s.title)).toContain('Bohemian Rhapsody');
  });

  it('agrega canciones nuevas a Trie, ranking y grafo', () => {
    const c = crear();
    const base = c.buscarPorTitulo('Shallow')!;
    const nueva = c.agregarCancion({ title: 'Nueva Canción', artist: 'Yo', genre: 'pop', plays: 2_000_000, similares: [base.id] });
    expect(c.existe('nueva cancion')).toBe(true);
    expect(c.ranking(1)[0].id).toBe(nueva.id);
    expect(c.relacionadas(base.id).map((s) => s.id)).toContain(nueva.id);
  });

  it('valida los datos de entrada', () => {
    const c = crear();
    const base = { title: 'X', artist: 'Y', genre: 'pop' as const, plays: 1, similares: [] };
    expect(() => c.agregarCancion({ ...base, title: '  ' })).toThrow();
    expect(() => c.agregarCancion({ ...base, artist: '' })).toThrow();
    expect(() => c.agregarCancion({ ...base, plays: -1 })).toThrow();
    expect(() => c.agregarCancion({ ...base, similares: ['no-existe'] })).toThrow();
    expect(() => c.agregarCancion({ ...base, title: 'Shallow', artist: 'Lady Gaga' })).toThrow();
  });
});
