# Parcial 3 – MiniSpotify Educativo (Angular + Sass)

Mini plataforma de música con estructuras de datos implementadas **desde cero**:

| Requisito | Estructura | Archivo |
|---|---|---|
| Buscador predictivo (insertar, existe, sugerencias por prefijo) | **Trie** | `src/app/core/structures/trie.ts` |
| Ranking TOP de canciones más escuchadas | **Max Heap** | `src/app/core/structures/max-heap.ts` |
| Canciones relacionadas | **Grafo no dirigido** | `src/app/core/structures/graph.ts` |
| Panel visual con estilos reutilizables | **Sass** (variables, funciones, mixins, parciales) | `src/styles/` |

`src/app/core/services/catalog.service.ts` une las tres estructuras.

## Ejecutar
```bash
npm install
npx ng serve      # http://localhost:4200
npx ng test       # pruebas unitarias (Karma, necesita Chrome)
npx ng build
```

## Cómo funciona
- **Trie:** cada letra es una arista; las claves se normalizan (minúsculas, sin tildes). `insert`, `search` (¿existe el título exacto?) y `suggest` (prefijo, en orden alfabético).
- **Max Heap:** arreglo con `push`, `pop`, `peek`, `heapify`, `percolateUp` y `percolateDown`. El ranking arma el heap con `heapify` y saca el TOP N con `pop`. Cada ▶ suma reproducciones y el ranking se reordena.
- **Grafo:** lista de nodos + objeto de adyacencia. Los vecinos directos son "Similares"; con un recorrido BFS a 2 saltos se calcula "También te puede gustar".
- **Sass:** `_variables.scss` (paleta, géneros, espaciado, funciones `clr()`, `sp()`, `rank-color()`), `_mixins.scss` (`card`, `button`, `badge`, `progress-track/fill`, `respond`…), `_theme.scss` (punto de entrada con `@forward`) y `_utilities.scss` (clases generadas con `@each`, como `.badge--pop`). Los componentes hacen `@use 'theme' as t;` (ruta configurada en `angular.json`).
