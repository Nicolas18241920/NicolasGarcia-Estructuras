import { computed, Injectable, signal } from '@angular/core';
import { SEED_LINKS, SEED_SONGS } from '../data/seed';
import { NewSongInput, Song } from '../models/song.model';
import { Grafo } from '../structures/graph';
import { MaxHeap } from '../structures/max-heap';
import { Trie } from '../structures/trie';

/** Cuántas reproducciones suma cada clic en "Reproducir". */
export const PLAY_STEP = 10_000;
const MAX_TITLE = 80;
const MAX_ARTIST = 60;

const collapse = (text: string): string => text.trim().replace(/\s+/g, ' ');

/** Más reproducciones = más prioridad; en empate gana el título que va primero alfabéticamente. */
const byPopularity = (a: Song, b: Song): number =>
  a.plays - b.plays || b.title.localeCompare(a.title, 'es');

/**
 * Catálogo de canciones. Combina las tres estructuras:
 *  - Trie  → búsqueda predictiva y existencia por título
 *  - MaxHeap → ranking de las más escuchadas
 *  - Grafo → canciones relacionadas
 * Los métodos de consulta leen la señal `version`, así cualquier `computed` que los use
 * se recalcula cuando el catálogo cambia.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly trie = new Trie<Song>();
  private readonly graph = new Grafo<Song>();
  private readonly version = signal(0);
  private counter = 0;

  /** Canción elegida en la interfaz (panel de recomendaciones). */
  readonly selectedId = signal<string | null>(null);

  readonly songs = computed(() => {
    this.version();
    return [...this.graph.getNodes()].sort((a, b) => a.title.localeCompare(b.title, 'es'));
  });

  readonly selected = computed(() => {
    this.version();
    const id = this.selectedId();
    return (id && this.graph.searchNode(id)) || null;
  });

  readonly trieStats = computed(() => {
    this.version();
    return { words: this.trie.words, nodes: this.trie.nodes };
  });

  constructor() {
    for (const [title, artist, genre, plays] of SEED_SONGS) {
      this.agregarCancion({ title, artist, genre, plays, similares: [] });
    }
    for (const [a, b] of SEED_LINKS) {
      this.conectar(this.buscarPorTitulo(a)!.id, this.buscarPorTitulo(b)!.id);
    }
  }

  // ---------- Trie: buscador predictivo ----------

  /** 1. Insertar una canción (también entra al grafo y, por tanto, al ranking). */
  agregarCancion(input: NewSongInput): Song {
    const title = collapse(input.title);
    const artist = collapse(input.artist);

    if (!title) throw new Error('El título es obligatorio.');
    if (title.length > MAX_TITLE) throw new Error(`El título no puede superar ${MAX_TITLE} caracteres.`);
    if (!artist) throw new Error('El artista es obligatorio.');
    if (artist.length > MAX_ARTIST) throw new Error(`El artista no puede superar ${MAX_ARTIST} caracteres.`);
    if (!Number.isInteger(input.plays) || input.plays < 0) {
      throw new Error('Las reproducciones deben ser un número entero mayor o igual a 0.');
    }
    if (this.trie.get(title).some((s) => s.artist.toLowerCase() === artist.toLowerCase())) {
      throw new Error(`«${title}» de ${artist} ya está en el catálogo.`);
    }
    const desconocida = input.similares.find((id) => !this.graph.searchNode(id));
    if (desconocida) throw new Error('Alguna de las canciones similares ya no existe.');

    const song: Song = { id: `s${++this.counter}`, title, artist, genre: input.genre, plays: input.plays };
    this.trie.insert(song.title, song);
    this.graph.addNode(song);
    input.similares.forEach((id) => this.graph.addEdge(song.id, id));
    this.version.update((v) => v + 1);
    return song;
  }

  /** 2. ¿Existe una canción con exactamente ese título? */
  existe(title: string): boolean {
    this.version();
    return this.trie.search(title);
  }

  /** 3. Sugerencias por prefijo, en orden alfabético. */
  sugerencias(prefix: string, limit = 8): Song[] {
    this.version();
    return this.trie.suggest(prefix, limit);
  }

  // ---------- Max Heap: ranking ----------

  /** Las `n` canciones más escuchadas: se arma un Max Heap (heapify) y se sacan con pop. */
  ranking(n: number): Song[] {
    this.version();
    const heap = MaxHeap.heapify(this.graph.getNodes(), byPopularity);
    const top: Song[] = [];
    while (top.length < n && !heap.isEmpty()) top.push(heap.pop()!);
    return top;
  }

  /** Suma reproducciones: el ranking cambia en vivo. */
  reproducir(id: string): void {
    const song = this.graph.searchNode(id);
    if (!song) return;
    song.plays += PLAY_STEP;
    this.version.update((v) => v + 1);
  }

  // ---------- Grafo: canciones relacionadas ----------

  /** Conecta dos canciones como similares (en ambos sentidos). */
  conectar(idA: string, idB: string): void {
    if (idA === idB) throw new Error('Una canción no puede ser similar a sí misma.');
    if (!this.graph.addEdge(idA, idB)) throw new Error('Esas canciones ya están conectadas o no existen.');
    this.version.update((v) => v + 1);
  }

  /** Vecinos directos en el grafo, de la más escuchada a la menos escuchada. */
  relacionadas(id: string): Song[] {
    this.version();
    return this.graph.neighbors(id).sort((a, b) => byPopularity(b, a));
  }

  /** "También te puede gustar": canciones a 2 saltos (amigos de los amigos) que aún no son vecinas. */
  extendidas(id: string, limit = 5): Song[] {
    this.version();
    const result: Song[] = [];
    for (const [otherId, distance] of this.graph.distancesFrom(id, 2)) {
      if (distance === 2) result.push(this.graph.searchNode(otherId)!);
    }
    return result.sort((a, b) => byPopularity(b, a)).slice(0, limit);
  }

  /** Lista de adyacencia en texto, para mostrar cómo está representado el grafo. */
  adyacencia(): string {
    this.version();
    return this.graph.print((s) => s.title);
  }

  buscarPorTitulo(title: string): Song | undefined {
    return this.trie.get(title)[0];
  }
}
