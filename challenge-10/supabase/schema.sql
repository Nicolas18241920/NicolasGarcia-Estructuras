-- =====================================================================
-- Challenge 10 – Supabase
-- Ejecutar completo en: Dashboard → SQL Editor → New query → Run
-- (es re-ejecutable: no falla si ya existe algo)
-- =====================================================================

-- 1) Tabla de tareas ---------------------------------------------------
create table if not exists public.tareas (
  id          bigint generated always as identity primary key,
  titulo      text not null,
  completada  boolean default false,
  user_id     uuid references auth.users on delete cascade default auth.uid(),
  created_at  timestamptz default now()
);

create index if not exists tareas_user_id_idx on public.tareas (user_id);

-- 2) Row Level Security: cada usuario solo ve/modifica lo suyo --------
alter table public.tareas enable row level security;

drop policy if exists "ver mis tareas"    on public.tareas;
drop policy if exists "crear mis tareas"  on public.tareas;
drop policy if exists "editar mis tareas" on public.tareas;
drop policy if exists "borrar mis tareas" on public.tareas;

create policy "ver mis tareas" on public.tareas
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "crear mis tareas" on public.tareas
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "editar mis tareas" on public.tareas
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "borrar mis tareas" on public.tareas
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 3) Realtime: publicar los cambios de la tabla -----------------------
do $$
begin
  alter publication supabase_realtime add table public.tareas;
exception when duplicate_object then null;
end $$;

-- 4) Storage: bucket público "avatars" --------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "subir a mi carpeta"         on storage.objects;
drop policy if exists "reemplazar mis archivos"    on storage.objects;
drop policy if exists "eliminar mis archivos"      on storage.objects;
drop policy if exists "ver mis archivos"           on storage.objects;

create policy "subir a mi carpeta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "reemplazar mis archivos" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "eliminar mis archivos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Necesaria para que list() devuelva solo los archivos del propio usuario
create policy "ver mis archivos" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
