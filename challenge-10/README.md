# Challenge 10 – Angular + Supabase

Registro, login, CRUD de tareas con RLS, lista en vivo (Realtime) y avatar en Storage.

## Puesta en marcha
1. Crea el proyecto en https://supabase.com (plan Free, región São Paulo).
2. En **SQL Editor** ejecuta `supabase/schema.sql` (tabla, RLS, realtime y bucket `avatars`).
3. En **Authentication → Sign In / Providers → Email** deja el correo habilitado; para desarrollo puedes desactivar *Confirm email*.
4. En **Authentication → URL Configuration** pon Site URL = `http://localhost:4200`.
5. Copia **Project URL** y la **Publishable key** a `src/environments/environment.ts`.
6. `npm install` y `npx ng serve`.

## Seguridad
- En el frontend solo va la publishable (anon) key. La secret / service_role NUNCA.
- La seguridad real está en las políticas RLS (tabla `tareas` y `storage.objects`).
