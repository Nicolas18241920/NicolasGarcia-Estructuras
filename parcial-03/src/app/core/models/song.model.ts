export type Genre = 'pop' | 'rock' | 'latino' | 'electronica' | 'clasica';

export const GENRES: readonly { id: Genre; label: string }[] = [
  { id: 'pop', label: 'Pop' },
  { id: 'rock', label: 'Rock' },
  { id: 'latino', label: 'Latino' },
  { id: 'electronica', label: 'Electrónica' },
  { id: 'clasica', label: 'Clásica' },
];

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  /** Número de reproducciones: es el criterio del ranking (Max Heap). */
  plays: number;
}

export interface NewSongInput {
  title: string;
  artist: string;
  genre: Genre;
  plays: number;
  /** ids de canciones similares con las que se conecta en el grafo. */
  similares: string[];
}
