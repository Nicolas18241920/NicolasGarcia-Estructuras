# Parcial 2 – Gestor jerárquico de carpetas y archivos (Angular + Firebase)

Aplicación web con un **árbol n-ario implementado desde cero** (`src/app/core/tree/n-ary-tree.ts`).

## Requisitos
- Node.js 20.19+ / 22.12+ / 24+ y npm
- Un proyecto de Firebase con **Authentication (correo/contraseña)** y **Firestore** habilitados

## Puesta en marcha
1. `npm install`
2. Pega tu `firebaseConfig` en `src/environments/environment.ts`
3. Publica `firestore.rules` en Firebase Console → Firestore → Reglas
4. `npx ng serve` y abre http://localhost:4200

## Estructura
- `core/tree`: `TreeNode` y `NaryTree` (lógica pura + pruebas)
- `core/services`: autenticación, repositorio Firestore y servicio de dominio
- `features/auth`: login/registro
- `features/explorer`: vista visual del árbol (SCSS)

## Reglas de negocio
- Solo usuarios autenticados crean/eliminan nodos.
- Cada nodo guarda `createdBy` (correo del creador).
- Un archivo no puede tener hijos; una carpeta sí.
