import { Trie } from './trie';

describe('Trie', () => {
  const crear = () => {
    const trie = new Trie<string>();
    ['Shape of You', 'Shallow', 'Thunder', 'Thunderstruck', 'Für Elise'].forEach((t) => trie.insert(t, t));
    return trie;
  };

  it('inserta y encuentra palabras exactas', () => {
    const trie = crear();
    expect(trie.search('Shallow')).toBe(true);
    expect(trie.search('Shall')).toBe(false); // es solo un prefijo
    expect(trie.search('Otra')).toBe(false);
  });

  it('ignora mayúsculas, tildes y espacios extra', () => {
    const trie = crear();
    expect(trie.search('  shape   OF you ')).toBe(true);
    expect(trie.search('fur elise')).toBe(true);
    expect(trie.search('FÜR ELISE')).toBe(true);
  });

  it('sugiere por prefijo en orden alfabético', () => {
    const trie = crear();
    expect(trie.suggest('sh')).toEqual(['Shallow', 'Shape of You']);
    expect(trie.suggest('thunder')).toEqual(['Thunder', 'Thunderstruck']);
    expect(trie.suggest('zzz')).toEqual([]);
  });

  it('respeta el límite de sugerencias', () => {
    expect(crear().suggest('', 2).length).toBe(2);
  });

  it('guarda varias canciones con el mismo título', () => {
    const trie = new Trie<string>();
    trie.insert('Hello', 'Adele');
    trie.insert('hello', 'Lionel Richie');
    expect(trie.words).toBe(1);
    expect(trie.get('Hello')).toEqual(['Adele', 'Lionel Richie']);
  });

  it('rechaza claves vacías y cuenta nodos', () => {
    const trie = new Trie<string>();
    expect(() => trie.insert('   ', 'x')).toThrow();
    trie.insert('ab', 'x');
    expect(trie.nodes).toBe(3); // raíz + a + b
  });
});
