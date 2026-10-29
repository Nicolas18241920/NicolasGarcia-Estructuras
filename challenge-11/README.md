# Challenge 11 – Grafo de amigos y ciudades (React + react-d3-graph)

- Cada **persona** y cada **ciudad** es un nodo.
- Una persona tiene **nombre y edad** y vive en **una sola ciudad**.
- Una ciudad tiene **nombre**.
- Se **imprime la lista de personas** que viven en una ciudad (en pantalla y en consola).
- El grafo se dibuja con **react-d3-graph**.

## Ejecutar
```bash
npm install
npm run dev      # http://localhost:5173
npm test         # pruebas del grafo (vitest)
npm run build    # compilación de producción
```
> `.npmrc` activa `legacy-peer-deps` porque react-d3-graph declara peerDependencies antiguas (React 16 / d3 5).

## Estructura
- `src/grafo/Grafo.ts`: grafo no dirigido desde cero (lista de nodos + objeto de adyacencia). Métodos de la clase: `addNode`, `searchNode`, `addEdge`, `removeNode`, `isEmpty`, `printAdjacency`, `print`.
- `src/grafo/GrafoSocial.ts`: reglas del dominio (personas, ciudades, amistades).
- `src/hooks/useGrafoSocial.ts`: estado en React + persistencia en `localStorage`.
- `src/components/`: formularios, lista por ciudad y vista del grafo.
