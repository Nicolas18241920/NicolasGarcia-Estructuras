import { Grafo } from './Grafo';
import type { GrafoJSON } from './Grafo';

export interface Persona {
  id: string;
  tipo: 'persona';
  nombre: string;
  edad: number;
}

export interface Ciudad {
  id: string;
  tipo: 'ciudad';
  nombre: string;
}

export type NodoSocial = Persona | Ciudad;

export interface Arista {
  origen: string;
  destino: string;
  /** "vive-en": persona–ciudad · "amistad": persona–persona */
  tipo: 'vive-en' | 'amistad';
}

export interface GrafoSocialJSON {
  contador: number;
  grafo: GrafoJSON<NodoSocial>;
}

const EDAD_MAX = 120;

const etiqueta = (n: NodoSocial): string =>
  n.tipo === 'persona' ? `${n.nombre} (${n.edad})` : `[${n.nombre}]`;

/**
 * Grafo de amigos y ciudades.
 *  - Cada persona y cada ciudad es un nodo.
 *  - Una persona tiene nombre, edad y está ligada a UNA sola ciudad.
 *  - Las personas se pueden hacer amigas entre sí.
 * Las reglas del dominio se validan aquí; los errores se lanzan como Error en español.
 */
export class GrafoSocial {
  private grafo = new Grafo<NodoSocial>();
  private contador = 0;

  // ---------- altas ----------

  agregarCiudad(nombre: string): Ciudad {
    const limpio = nombre.trim();
    if (!limpio) throw new Error('El nombre de la ciudad es obligatorio.');
    if (this.ciudades().some((c) => c.nombre.toLowerCase() === limpio.toLowerCase())) {
      throw new Error(`La ciudad "${limpio}" ya existe.`);
    }
    const ciudad: Ciudad = { id: this.nuevoId('c'), tipo: 'ciudad', nombre: limpio };
    this.grafo.addNode(ciudad);
    return ciudad;
  }

  agregarPersona(nombre: string, edad: number, ciudadId: string): Persona {
    const limpio = nombre.trim();
    if (!limpio) throw new Error('El nombre de la persona es obligatorio.');
    if (!Number.isInteger(edad) || edad < 0 || edad > EDAD_MAX) {
      throw new Error(`La edad debe ser un número entero entre 0 y ${EDAD_MAX}.`);
    }
    const ciudad = this.grafo.searchNode(ciudadId);
    if (!ciudad || ciudad.tipo !== 'ciudad') {
      throw new Error('Toda persona debe vivir en una ciudad existente.');
    }
    const persona: Persona = { id: this.nuevoId('p'), tipo: 'persona', nombre: limpio, edad };
    this.grafo.addNode(persona);
    this.grafo.addEdge(persona.id, ciudad.id);
    return persona;
  }

  agregarAmistad(idA: string, idB: string): void {
    const a = this.grafo.searchNode(idA);
    const b = this.grafo.searchNode(idB);
    if (!a || !b || a.tipo !== 'persona' || b.tipo !== 'persona') {
      throw new Error('Solo se puede hacer amistad entre dos personas existentes.');
    }
    if (idA === idB) throw new Error('Una persona no puede ser amiga de sí misma.');
    if (!this.grafo.addEdge(idA, idB)) throw new Error(`${a.nombre} y ${b.nombre} ya son amigos.`);
  }

  // ---------- bajas ----------

  /** Elimina una persona, o una ciudad SIN habitantes (toda persona debe tener ciudad). */
  eliminarNodo(id: string): void {
    const nodo = this.grafo.searchNode(id);
    if (!nodo) throw new Error('El elemento no existe.');
    if (nodo.tipo === 'ciudad' && this.personasEnCiudad(id).length > 0) {
      throw new Error(`No se puede eliminar ${nodo.nombre}: todavía tiene habitantes.`);
    }
    this.grafo.removeNode(id);
  }

  // ---------- consultas ----------

  buscar(id: string): NodoSocial | undefined {
    return this.grafo.searchNode(id);
  }

  ciudades(): Ciudad[] {
    return this.grafo.getNodes().filter((n): n is Ciudad => n.tipo === 'ciudad');
  }

  personas(): Persona[] {
    return this.grafo.getNodes().filter((n): n is Persona => n.tipo === 'persona');
  }

  /** Personas que viven en una ciudad, ordenadas por nombre. */
  personasEnCiudad(ciudadId: string): Persona[] {
    return this.grafo
      .neighbors(ciudadId)
      .filter((n): n is Persona => n.tipo === 'persona')
      .sort((x, y) => x.nombre.localeCompare(y.nombre, 'es'));
  }

  ciudadDe(personaId: string): Ciudad | undefined {
    return this.grafo.neighbors(personaId).find((n): n is Ciudad => n.tipo === 'ciudad');
  }

  amigosDe(personaId: string): Persona[] {
    return this.grafo.neighbors(personaId).filter((n): n is Persona => n.tipo === 'persona');
  }

  nodos(): readonly NodoSocial[] {
    return this.grafo.getNodes();
  }

  aristas(): Arista[] {
    return this.grafo.getEdges().map(([origen, destino]) => {
      const a = this.grafo.searchNode(origen)!;
      const b = this.grafo.searchNode(destino)!;
      return { origen, destino, tipo: a.tipo === b.tipo ? 'amistad' : 'vive-en' };
    });
  }

  estaVacio(): boolean {
    return this.grafo.isEmpty();
  }

  /** Lista de adyacencia en texto (para mostrar o imprimir en consola). */
  imprimir(): string {
    return this.grafo.print(etiqueta);
  }

  /** Texto con la lista de personas de una ciudad. */
  imprimirPersonasEnCiudad(ciudadId: string): string {
    const ciudad = this.grafo.searchNode(ciudadId);
    if (!ciudad || ciudad.tipo !== 'ciudad') return '';
    const gente = this.personasEnCiudad(ciudadId);
    if (!gente.length) return `En ${ciudad.nombre} no vive nadie.`;
    return `Personas que viven en ${ciudad.nombre}:\n` + gente.map((p) => `- ${p.nombre} (${p.edad} años)`).join('\n');
  }

  // ---------- persistencia ----------

  toJSON(): GrafoSocialJSON {
    return { contador: this.contador, grafo: this.grafo.toJSON() };
  }

  static fromJSON(datos: GrafoSocialJSON): GrafoSocial {
    const social = new GrafoSocial();
    social.contador = datos.contador;
    social.grafo = Grafo.fromJSON(datos.grafo);
    return social;
  }

  clonar(): GrafoSocial {
    return GrafoSocial.fromJSON(this.toJSON());
  }

  private nuevoId(prefijo: 'c' | 'p'): string {
    this.contador += 1;
    return `${prefijo}${this.contador}`;
  }
}
