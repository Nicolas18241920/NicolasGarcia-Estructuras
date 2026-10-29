import { useEffect, useMemo, useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';
import type { GrafoSocial } from '../grafo/GrafoSocial';

interface Props {
  grafo: GrafoSocial;
  ciudadSeleccionada: string;
  onClickCiudad: (id: string) => void;
}

const COLOR_CIUDAD = '#f59e0b';
const COLOR_PERSONA = '#10b981';
const COLOR_AMISTAD = '#94a3b8';
const ALTO = 520;

/** Dibuja el grafo con react-d3-graph. */
export function GrafoVista({ grafo, ciudadSeleccionada, onClickCiudad }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(720);

  // Ajusta el ancho del grafo al del contenedor.
  useEffect(() => {
    const el = contenedor.current;
    if (!el) return;
    const observador = new ResizeObserver(([entrada]) => setAncho(Math.max(320, Math.floor(entrada.contentRect.width))));
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // react-d3-graph modifica los objetos que recibe: se le entrega una copia nueva cada vez.
  const datos = useMemo(
    () => ({
      nodes: grafo.nodos().map((n, i) => {
        // Posición inicial en espiral alrededor del centro: evita que un nodo sin
        // conexiones quede pegado en la esquina (0,0) del lienzo.
        const angulo = i * 2.4;
        const radio = 50 + i * 14;
        const x = ancho / 2 + Math.cos(angulo) * radio;
        const y = ALTO / 2 + Math.sin(angulo) * radio;
        return n.tipo === 'ciudad'
          ? {
              id: n.id,
              x,
              y,
              label: n.nombre,
              color: COLOR_CIUDAD,
              symbolType: 'square',
              size: n.id === ciudadSeleccionada ? 1100 : 800,
              strokeColor: n.id === ciudadSeleccionada ? '#b45309' : 'none',
              strokeWidth: 3,
            }
          : { id: n.id, x, y, label: `${n.nombre} (${n.edad})`, color: COLOR_PERSONA, symbolType: 'circle', size: 450 };
      }),
      links: grafo.aristas().map((a) => ({
        source: a.origen,
        target: a.destino,
        color: a.tipo === 'vive-en' ? COLOR_CIUDAD : COLOR_AMISTAD,
        strokeWidth: a.tipo === 'vive-en' ? 2.5 : 1.5,
        strokeDasharray: a.tipo === 'vive-en' ? 4 : 0,
      })),
    }),
    [grafo, ciudadSeleccionada, ancho],
  );

  // Cambia la "llave" cuando cambia la estructura para que el grafo se reordene limpio.
  const llave = useMemo(
    () => grafo.nodos().map((n) => n.id).join(',') + '|' + grafo.aristas().map((a) => `${a.origen}-${a.destino}`).join(','),
    [grafo],
  );

  const configuracion = useMemo(
    () => ({
      width: ancho,
      height: ALTO,
      directed: false,
      nodeHighlightBehavior: true,
      linkHighlightBehavior: true,
      node: {
        labelProperty: 'label' as const,
        fontSize: 13,
        highlightFontSize: 14,
        highlightStrokeColor: '#0f766e',
      },
      link: { highlightColor: '#0f766e' },
      d3: { gravity: -400, linkLength: 160 },
    }),
    [ancho],
  );

  return (
    <div className="grafo" ref={contenedor}>
      <div className="leyenda">
        <span><i className="punto persona" /> Persona</span>
        <span><i className="punto ciudad" /> Ciudad</span>
        <span><i className="raya amistad" /> Amistad</span>
        <span><i className="raya vive" /> Vive en</span>
      </div>

      {grafo.estaVacio() ? (
        <p className="empty vacio">El grafo está vacío. Agrega una ciudad para empezar.</p>
      ) : (
        <Graph
          key={llave}
          id="grafo-amigos-ciudades"
          data={datos}
          config={configuracion}
          onClickNode={(id: string) => {
            if (grafo.buscar(id)?.tipo === 'ciudad') onClickCiudad(id);
          }}
        />
      )}
    </div>
  );
}
