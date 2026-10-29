import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  onAgregar: (nombre: string) => boolean;
}

export function FormCiudad({ onAgregar }: Props) {
  const [nombre, setNombre] = useState('');

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (onAgregar(nombre)) setNombre('');
  }

  return (
    <form className="card" onSubmit={enviar}>
      <h2>Nueva ciudad</h2>
      <label>
        Nombre
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Cali" maxLength={40} />
      </label>
      <button type="submit">Agregar ciudad</button>
    </form>
  );
}
