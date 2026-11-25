/** Nodo del Trie: la información está en el camino, no en el nodo. */
export class TrieNode<T> {
  /** Cada arista es una letra. */
  readonly children = new Map<string, TrieNode<T>>();
  /** Datos asociados a la palabra que termina en este nodo. */
  readonly values: T[] = [];
  isEndOfWord = false;
}

/**
 * Trie (árbol de prefijos) implementado desde cero.
 * Las claves se normalizan: minúsculas, sin tildes y con espacios simples,
 * así "Für Elise" y "fur elise" son la misma clave.
 */
export class Trie<T> {
  /** Raíz vacía: no representa ningún carácter. */
  readonly root = new TrieNode<T>();
  private wordCount = 0;
  private nodeCount = 1;

  static normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trimStart();
  }

  /** Cantidad de palabras distintas guardadas. */
  get words(): number {
    return this.wordCount;
  }

  /** Cantidad de nodos (incluida la raíz). */
  get nodes(): number {
    return this.nodeCount;
  }

  /** Inserta una palabra letra por letra y marca el último nodo como fin de palabra. */
  insert(key: string, value: T): void {
    const clean = Trie.normalize(key).trimEnd();
    if (!clean) throw new Error('La clave no puede estar vacía.');

    let current = this.root;
    for (const character of clean) {
      let next = current.children.get(character);
      if (!next) {
        next = new TrieNode<T>();
        current.children.set(character, next);
        this.nodeCount++;
      }
      current = next;
    }

    if (!current.isEndOfWord) {
      current.isEndOfWord = true;
      this.wordCount++;
    }
    current.values.push(value);
  }

  /** ¿Existe exactamente esta palabra? */
  search(key: string): boolean {
    const node = this.walk(Trie.normalize(key).trim());
    return !!node && node.isEndOfWord;
  }

  /** Datos de la palabra exacta (varias canciones pueden compartir título). */
  get(key: string): readonly T[] {
    const node = this.walk(Trie.normalize(key).trim());
    return node?.isEndOfWord ? node.values : [];
  }

  /** ¿Hay alguna palabra que empiece con este prefijo? */
  startsWith(prefix: string): boolean {
    return this.walk(Trie.normalize(prefix)) !== undefined;
  }

  /** Datos de las palabras que empiezan con el prefijo, en orden alfabético. */
  suggest(prefix: string, limit = Infinity): T[] {
    const start = this.walk(Trie.normalize(prefix));
    if (!start) return [];

    const result: T[] = [];
    const stack: TrieNode<T>[] = [start];
    while (stack.length && result.length < limit) {
      const node = stack.pop()!;
      if (node.isEndOfWord) {
        for (const value of node.values) {
          if (result.length >= limit) break;
          result.push(value);
        }
      }
      // Se apilan al revés para visitar primero las letras menores (orden alfabético).
      const letters = [...node.children.keys()].sort();
      for (let i = letters.length - 1; i >= 0; i--) stack.push(node.children.get(letters[i])!);
    }
    return result;
  }

  /** Recorre el camino de un texto ya normalizado; undefined si se corta. */
  private walk(normalized: string): TrieNode<T> | undefined {
    let current = this.root;
    for (const character of normalized) {
      const next = current.children.get(character);
      if (!next) return undefined;
      current = next;
    }
    return current;
  }
}
