import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { GifItem, GiphySearchResponse } from '../models/giphy.model';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  private readonly apiUrl = `${environment.giphyBaseUrl}/search`;
  private readonly apiKey = environment.giphyApiKey;
  private abortController: AbortController | null = null;

  // Estado reactivo con Signals (siguiendo el ejemplo de Angular en clase)
  gifs = signal<GifItem[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  totalCount = signal<number>(0);

  async searchGifs(
    query: string,
    limit: number = 25,
    offset: number = 0,
    rating: string = 'g',
    lang: string = 'en'
  ): Promise<void> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      this.gifs.set([]);
      this.totalCount.set(0);
      this.error.set(null);
      return;
    }

    // Cancelar peticion anterior si el usuario sigue escribiendo (AbortController)
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    this.loading.set(true);
    this.error.set(null);

    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        q: trimmedQuery,
        limit: limit.toString(),
        offset: offset.toString(),
        rating,
        lang
      });

      const resp = await fetch(`${this.apiUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        signal: this.abortController.signal
      });

      // Fetch no lanza error automatico en 404 o 500, siempre validamos resp.ok
      if (!resp.ok) {
        const errorBody = await resp.json().catch(() => null);
        throw new Error(errorBody?.meta?.msg ?? `HTTP ${resp.status}: ${resp.statusText}`);
      }

      const body: GiphySearchResponse = await resp.json();
      this.gifs.set(body.data);
      this.totalCount.set(body.pagination?.total_count ?? body.data.length);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Peticion cancelada intencionalmente por una nueva busqueda
        return;
      }
      const message = err instanceof Error ? err.message : 'Error inesperado al consultar GIPHY';
      this.error.set(message);
      this.gifs.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
