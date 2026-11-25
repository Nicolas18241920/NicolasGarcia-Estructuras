import { Genre } from '../models/song.model';

/** Canciones de ejemplo: [título, artista, género, reproducciones]. */
export const SEED_SONGS: readonly [string, string, Genre, number][] = [
  ['Blinding Lights', 'The Weeknd', 'pop', 980_000],
  ['Shape of You', 'Ed Sheeran', 'pop', 950_000],
  ['Levitating', 'Dua Lipa', 'pop', 870_000],
  ["Don't Start Now", 'Dua Lipa', 'pop', 780_000],
  ['Bad Guy', 'Billie Eilish', 'pop', 820_000],
  ['Someone You Loved', 'Lewis Capaldi', 'pop', 700_000],
  ['Shallow', 'Lady Gaga', 'pop', 640_000],
  ['Believer', 'Imagine Dragons', 'rock', 760_000],
  ['Thunder', 'Imagine Dragons', 'rock', 690_000],
  ['Thunderstruck', 'AC/DC', 'rock', 600_000],
  ['Bohemian Rhapsody', 'Queen', 'rock', 910_000],
  ['Hotel California', 'Eagles', 'rock', 580_000],
  ['Despacito', 'Luis Fonsi', 'latino', 990_000],
  ['Bailando', 'Enrique Iglesias', 'latino', 540_000],
  ['La Camisa Negra', 'Juanes', 'latino', 520_000],
  ['Titanium', 'David Guetta', 'electronica', 660_000],
  ['Wake Me Up', 'Avicii', 'electronica', 730_000],
  ['Clair de Lune', 'Claude Debussy', 'clasica', 430_000],
  ['Für Elise', 'Ludwig van Beethoven', 'clasica', 450_000],
];

/** Pares de títulos que se consideran similares (aristas del grafo). */
export const SEED_LINKS: readonly [string, string][] = [
  ['Blinding Lights', 'Levitating'],
  ['Blinding Lights', "Don't Start Now"],
  ['Levitating', "Don't Start Now"],
  ['Levitating', 'Bad Guy'],
  ["Don't Start Now", 'Bad Guy'],
  ['Shape of You', 'Someone You Loved'],
  ['Shape of You', 'Shallow'],
  ['Someone You Loved', 'Shallow'],
  ['Believer', 'Thunder'],
  ['Thunder', 'Thunderstruck'],
  ['Believer', 'Titanium'],
  ['Titanium', 'Wake Me Up'],
  ['Wake Me Up', 'Believer'],
  ['Bohemian Rhapsody', 'Hotel California'],
  ['Bohemian Rhapsody', 'Thunderstruck'],
  ['Despacito', 'Bailando'],
  ['Bailando', 'La Camisa Negra'],
  ['Despacito', 'La Camisa Negra'],
  ['Clair de Lune', 'Für Elise'],
];
