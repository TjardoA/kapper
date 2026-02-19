-- Standardize RLS + admin policies + make is_admin search_path safe

-- Hard-set search_path inside is_admin to avoid mutable search_path warning
create or replace function public.is_admin()
returns boolean
language plpgsql
set search_path = public
stable
as $$
begin
  return coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
end;
$$;

-- Helper to (re)enable RLS and reset policies for a table
do $$
declare
  t text;
  policy_name text;
begin
  foreach t in array ARRAY['services','team_members','reviews','gallery_images','opening_hours','site_info','usps'] loop
    execute format('alter table public.%I enable row level security', t);
    -- drop all existing policies for this table
    for policy_name in
      select policyname from pg_policies where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on public.%I', policy_name, t);
    end loop;
    -- public select
    execute format($f$
      create policy "select_%1$s_public" on public.%1$s
      for select using (true);
    $f$, t);
    -- admin full access
    execute format($f$
      create policy "admin_all_%1$s" on public.%1$s
      for all to authenticated
      using (is_admin())
      with check (is_admin());
    $f$, t);
  end loop;
end$$;

-- Ensure gallery storage bucket exists and is public
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = excluded.public;

-- Storage policies for gallery bucket
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public read gallery images') then
    create policy "Public read gallery images" on storage.objects
      for select using (bucket_id = 'gallery');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Admin write gallery images') then
    create policy "Admin write gallery images" on storage.objects
      for all to authenticated
      using (bucket_id = 'gallery' and is_admin())
      with check (bucket_id = 'gallery' and is_admin());
  end if;
end$$;
