import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Persona } from '../grafo/GrafoSocial';

interface Props {
  personas: Persona[];
  onAgregar: (idA: string, idB: string) => boolean;
}

export function FormAmistad({ personas, onAgregar }: Props) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const idA = a || personas[0]?.id || '';
  const idB = b || personas[1]?.id || personas[0]?.id || '';

  function enviar(e: FormEvent) {
    e.preventDefault();
    onAgregar(idA, idB);
  }

  const opciones = personas.map((p) => (
    <option key={p.id} value={p.id}>
      {p.nombre} ({p.edad})
    </option>
  ));

  return (
    <form className="card" onSubmit={enviar}>
      <h2>Nueva amistad</h2>
      <label>
        Persona
        <select value={idA} onChange={(e) => setA(e.target.value)} disabled={personas.length < 2}>
          {opciones}
        </select>
      </label>
      <label>
        es amiga de
        <select value={idB} onChange={(e) => setB(e.target.value)} disabled={personas.length < 2}>
          {opciones}
        </select>
      </label>
      <button type="submit" disabled={personas.length < 2}>
        Hacer amigos
      </button>
    </form>
  );
}
