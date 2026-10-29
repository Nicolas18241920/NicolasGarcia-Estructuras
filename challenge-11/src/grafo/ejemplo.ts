import { GrafoSocial } from './GrafoSocial';

/** Datos de ejemplo para ver el grafo desde el primer momento. */
export function crearEjemplo(): GrafoSocial {
  const g = new GrafoSocial();
  const cali = g.agregarCiudad('Cali');
  const bogota = g.agregarCiudad('Bogotá');
  const medellin = g.agregarCiudad('Medellín');

  const ana = g.agregarPersona('Ana', 25, cali.id);
  const luis = g.agregarPersona('Luis', 30, cali.id);
  const maria = g.agregarPersona('María', 22, bogota.id);
  const carlos = g.agregarPersona('Carlos', 28, bogota.id);
  const sofia = g.agregarPersona('Sofía', 35, medellin.id);
  const juan = g.agregarPersona('Juan', 27, medellin.id);

  g.agregarAmistad(ana.id, luis.id);
  g.agregarAmistad(ana.id, maria.id);
  g.agregarAmistad(luis.id, carlos.id);
  g.agregarAmistad(maria.id, sofia.id);
  g.agregarAmistad(carlos.id, juan.id);
  g.agregarAmistad(sofia.id, juan.id);
  return g;
}
