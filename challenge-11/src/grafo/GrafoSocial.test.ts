import { describe, expect, it } from 'vitest';
import { crearEjemplo } from './ejemplo';
import { GrafoSocial } from './GrafoSocial';

describe('GrafoSocial', () => {
  it('guarda personas con nombre, edad y una ciudad', () => {
    const g = new GrafoSocial();
    const cali = g.agregarCiudad('Cali');
    const ana = g.agregarPersona('Ana', 25, cali.id);
    expect(g.ciudadDe(ana.id)?.nombre).toBe('Cali');
    expect(g.buscar(ana.id)).toMatchObject({ nombre: 'Ana', edad: 25 });
  });

  it('rechaza una persona sin ciudad válida', () => {
    const g = new GrafoSocial();
    expect(() => g.agregarPersona('Ana', 25, 'c99')).toThrow();
  });

  it('rechaza nombres vacíos, edades inválidas y ciudades repetidas', () => {
    const g = new GrafoSocial();
    const cali = g.agregarCiudad('Cali');
    expect(() => g.agregarCiudad('  ')).toThrow();
    expect(() => g.agregarCiudad('cali')).toThrow();
    expect(() => g.agregarPersona('', 20, cali.id)).toThrow();
    expect(() => g.agregarPersona('Ana', -1, cali.id)).toThrow();
    expect(() => g.agregarPersona('Ana', 20.5, cali.id)).toThrow();
  });

  it('lista las personas que viven en una ciudad', () => {
    const g = crearEjemplo();
    const cali = g.ciudades().find((c) => c.nombre === 'Cali')!;
    expect(g.personasEnCiudad(cali.id).map((p) => p.nombre)).toEqual(['Ana', 'Luis']);
    expect(g.imprimirPersonasEnCiudad(cali.id)).toContain('Ana (25 años)');
  });

  it('crea amistades solo entre personas y sin repetirlas', () => {
    const g = new GrafoSocial();
    const cali = g.agregarCiudad('Cali');
    const ana = g.agregarPersona('Ana', 25, cali.id);
    const luis = g.agregarPersona('Luis', 30, cali.id);
    g.agregarAmistad(ana.id, luis.id);
    expect(g.amigosDe(ana.id).map((p) => p.nombre)).toEqual(['Luis']);
    expect(() => g.agregarAmistad(luis.id, ana.id)).toThrow();
    expect(() => g.agregarAmistad(ana.id, ana.id)).toThrow();
    expect(() => g.agregarAmistad(ana.id, cali.id)).toThrow();
  });

  it('no deja eliminar una ciudad con habitantes, pero sí una persona', () => {
    const g = new GrafoSocial();
    const cali = g.agregarCiudad('Cali');
    const ana = g.agregarPersona('Ana', 25, cali.id);
    expect(() => g.eliminarNodo(cali.id)).toThrow();
    g.eliminarNodo(ana.id);
    expect(g.personasEnCiudad(cali.id)).toEqual([]);
    g.eliminarNodo(cali.id);
    expect(g.estaVacio()).toBe(true);
  });

  it('se puede guardar y recuperar sin perder datos', () => {
    const original = crearEjemplo();
    const copia = GrafoSocial.fromJSON(JSON.parse(JSON.stringify(original.toJSON())));
    expect(copia.imprimir()).toBe(original.imprimir());
    expect(copia.aristas().length).toBe(original.aristas().length);
  });
});
