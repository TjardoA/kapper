-- Recreate clean RLS: public read, admin full access
begin;

-- canonical is_admin using raw app_metadata.role
create or replace function public.is_admin()
returns boolean
language plpgsql
set search_path = public
stable
as $$
begin
  return (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin';
end;
$$;

-- Enable RLS on all CMS tables
do $$
declare t text;
begin
  foreach t in array ARRAY[
    'services','team_members','opening_hours',
    'reviews','gallery_images','site_info','usps','appointments'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end$$;

-- Public SELECT (frontend) for content tables (appointments excluded)
do $$
declare t text;
begin
  foreach t in array ARRAY[
    'services','team_members','opening_hours',
    'reviews','gallery_images','site_info','usps'
  ] loop
    execute format(
      'create policy %I on public.%I for select using (true);',
      'select_'||t||'_public', t
    );
  end loop;
end$$;

-- Admin full access (USING + WITH CHECK) for all tables
do $$
declare t text;
begin
  foreach t in array ARRAY[
    'services','team_members','opening_hours',
    'reviews','gallery_images','site_info','usps','appointments'
  ] loop
    execute format(
      'create policy %I on public.%I for all to authenticated using ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'') with check ((auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'');',
      'admin_all_'||t, t
    );
  end loop;
end$$;

commit;
