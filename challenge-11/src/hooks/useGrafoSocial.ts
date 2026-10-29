import { useCallback, useEffect, useState } from 'react';
import { crearEjemplo } from '../grafo/ejemplo';
import { GrafoSocial } from '../grafo/GrafoSocial';

const CLAVE = 'challenge-11:grafo';

function cargar(): GrafoSocial {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) return GrafoSocial.fromJSON(JSON.parse(guardado));
  } catch {
    // datos corruptos o sin acceso a localStorage: se parte del ejemplo
  }
  return crearEjemplo();
}

/**
 * Estado del grafo en React: cada cambio trabaja sobre una copia y la reemplaza,
 * así React detecta el cambio. Guarda en localStorage para no perder datos al recargar.
 */
export function useGrafoSocial() {
  const [grafo, setGrafo] = useState<GrafoSocial>(cargar);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(grafo.toJSON()));
    } catch {
      // sin persistencia: la app sigue funcionando en memoria
    }
  }, [grafo]);

  /** Aplica un cambio. Devuelve true si salió bien; si no, deja el mensaje en `error`. */
  const modificar = useCallback(
    (accion: (g: GrafoSocial) => void): boolean => {
      try {
        const copia = grafo.clonar();
        accion(copia);
        setGrafo(copia);
        setError('');
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.');
        return false;
      }
    },
    [grafo],
  );

  const cargarEjemplo = useCallback(() => {
    setGrafo(crearEjemplo());
    setError('');
  }, []);

  const vaciar = useCallback(() => {
    setGrafo(new GrafoSocial());
    setError('');
  }, []);

  return { grafo, error, modificar, cargarEjemplo, vaciar };
}
