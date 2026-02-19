-- Remove all existing policies on CMS tables to avoid duplicates/conflicts
begin;
do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'services','team_members','opening_hours',
        'reviews','gallery_images','site_info','usps','appointments'
      )
  loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;
end$$;
commit;
