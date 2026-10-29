import type { Ciudad, Persona } from '../grafo/GrafoSocial';

interface Props {
  ciudades: Ciudad[];
  ciudadId: string;
  personas: Persona[];
  onCambiarCiudad: (id: string) => void;
  onEliminar: (id: string) => void;
  onImprimirConsola: () => void;
}

/** Imprime en pantalla la lista de personas que viven en la ciudad elegida. */
export function PersonasPorCiudad({ ciudades, ciudadId, personas, onCambiarCiudad, onEliminar, onImprimirConsola }: Props) {
  const ciudad = ciudades.find((c) => c.id === ciudadId);

  return (
    <section className="card">
      <h2>¿Quién vive en…?</h2>
      <label>
        Ciudad
        <select value={ciudadId} onChange={(e) => onCambiarCiudad(e.target.value)} disabled={!ciudades.length}>
          {ciudades.length === 0 && <option value="">No hay ciudades</option>}
          {ciudades.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </label>
      <p className="hint">También puedes hacer clic en una ciudad (cuadrado) del grafo.</p>

      {ciudad && (
        <>
          <h3>Personas que viven en {ciudad.nombre}</h3>
          {personas.length === 0 ? (
            <p className="empty">En {ciudad.nombre} no vive nadie.</p>
          ) : (
            <ul className="lista">
              {personas.map((p) => (
                <li key={p.id}>
                  <span>
                    {p.nombre} <small>({p.edad} años)</small>
                  </span>
                  <button type="button" className="link" onClick={() => onEliminar(p.id)} aria-label={`Eliminar a ${p.nombre}`}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="acciones">
            <button type="button" className="secundario" onClick={onImprimirConsola}>
              Imprimir en consola
            </button>
            {personas.length === 0 && (
              <button type="button" className="peligro" onClick={() => onEliminar(ciudad.id)}>
                Eliminar ciudad
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
