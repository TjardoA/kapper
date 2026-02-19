-- Ensure every CMS table has uuid PK with gen_random_uuid() and created_at default now()
begin;

-- services
alter table public.services
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

-- team_members
alter table public.team_members
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

-- opening_hours
alter table public.opening_hours
  alter column id set default gen_random_uuid();
alter table public.opening_hours
  add column if not exists created_at timestamptz default now();
alter table public.opening_hours
  alter column created_at set default now();

-- reviews
alter table public.reviews
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

-- gallery_images
alter table public.gallery_images
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

-- usps
alter table public.usps
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

-- site_info: convert id to uuid safely (no drop), keep existing row
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='site_info'
      and column_name='id' and data_type <> 'uuid'
  ) then
    alter table public.site_info alter column id drop default;
    alter table public.site_info alter column id type uuid using gen_random_uuid();
  end if;
end$$;
alter table public.site_info
  alter column id set default gen_random_uuid();
alter table public.site_info
  add column if not exists created_at timestamptz default now();
alter table public.site_info
  alter column created_at set default now();

-- appointments
alter table public.appointments
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

commit;
