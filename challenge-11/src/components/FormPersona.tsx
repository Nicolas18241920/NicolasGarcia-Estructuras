import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Ciudad } from '../grafo/GrafoSocial';

interface Props {
  ciudades: Ciudad[];
  onAgregar: (nombre: string, edad: number, ciudadId: string) => boolean;
}

export function FormPersona({ ciudades, onAgregar }: Props) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [ciudadId, setCiudadId] = useState('');

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (onAgregar(nombre, Number(edad), ciudadId || ciudades[0]?.id || '')) {
      setNombre('');
      setEdad('');
    }
  }

  return (
    <form className="card" onSubmit={enviar}>
      <h2>Nueva persona</h2>
      <label>
        Nombre
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Ana" maxLength={40} />
      </label>
      <label>
        Edad
        <input type="number" min={0} max={120} value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="Ej. 25" />
      </label>
      <label>
        Ciudad donde vive
        <select value={ciudadId || ciudades[0]?.id || ''} onChange={(e) => setCiudadId(e.target.value)} disabled={!ciudades.length}>
          {ciudades.length === 0 && <option value="">Primero crea una ciudad</option>}
          {ciudades.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={!ciudades.length}>
        Agregar persona
      </button>
    </form>
  );
}
