import { useState } from 'react';
import { FormAmistad } from './components/FormAmistad';
import { FormCiudad } from './components/FormCiudad';
import { FormPersona } from './components/FormPersona';
import { GrafoVista } from './components/GrafoVista';
import { PersonasPorCiudad } from './components/PersonasPorCiudad';
import { useGrafoSocial } from './hooks/useGrafoSocial';
import './App.css';

export default function App() {
  const { grafo, error, modificar, cargarEjemplo, vaciar } = useGrafoSocial();
  const [ciudadElegida, setCiudadElegida] = useState('');

  const ciudades = grafo.ciudades();
  const personas = grafo.personas();

  // Si la ciudad elegida ya no existe (o no hay ninguna elegida), se usa la primera.
  const ciudadId = ciudades.some((c) => c.id === ciudadElegida) ? ciudadElegida : (ciudades[0]?.id ?? '');

  function imprimirEnConsola() {
    console.log(grafo.imprimirPersonasEnCiudad(ciudadId));
  }

  return (
    <div className="app">
      <header className="encabezado">
        <div>
          <h1>🕸️ Grafo de amigos y ciudades</h1>
          <p>Challenge 11 · Estructuras de Datos II</p>
        </div>
        <div className="acciones">
          <button type="button" className="secundario" onClick={cargarEjemplo}>
            Cargar ejemplo
          </button>
          <button type="button" className="peligro" onClick={vaciar}>
            Vaciar
          </button>
        </div>
      </header>

      {error && (
        <p className="alerta" role="alert">
          {error}
        </p>
      )}

      <main className="layout">
        <aside className="lateral">
          <FormCiudad onAgregar={(nombre) => modificar((g) => g.agregarCiudad(nombre))} />
          <FormPersona
            ciudades={ciudades}
            onAgregar={(nombre, edad, ciudad) => modificar((g) => g.agregarPersona(nombre, edad, ciudad))}
          />
          <FormAmistad personas={personas} onAgregar={(a, b) => modificar((g) => g.agregarAmistad(a, b))} />
        </aside>

        <section className="principal">
          <GrafoVista grafo={grafo} ciudadSeleccionada={ciudadId} onClickCiudad={setCiudadElegida} />

          <PersonasPorCiudad
            ciudades={ciudades}
            ciudadId={ciudadId}
            personas={ciudadId ? grafo.personasEnCiudad(ciudadId) : []}
            onCambiarCiudad={setCiudadElegida}
            onEliminar={(id) => modificar((g) => g.eliminarNodo(id))}
            onImprimirConsola={imprimirEnConsola}
          />

          <details className="card">
            <summary>Ver estructura (lista de adyacencia)</summary>
            <pre>{grafo.imprimir() || '(grafo vacío)'}</pre>
          </details>
        </section>
      </main>
    </div>
  );
}
