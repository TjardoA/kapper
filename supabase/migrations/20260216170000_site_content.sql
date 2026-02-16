-- Site content tables for homepage (USPs, reviews, gallery, site info)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

create table if not exists public.usps (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  position integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  created_at timestamptz default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  position integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.site_info (
  id integer primary key default 1,
  address text,
  phone text,
  whatsapp text,
  maps_url text,
  hero_tagline text,
  hero_title text,
  hero_subtitle text
);

insert into public.site_info (id) values (1)
on conflict (id) do nothing;

-- RLS
alter table public.usps enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery_images enable row level security;
alter table public.site_info enable row level security;

-- Public read
create policy "Public select usps" on public.usps for select using (true);
create policy "Public select reviews" on public.reviews for select using (true);
create policy "Public select gallery" on public.gallery_images for select using (true);
create policy "Public select site_info" on public.site_info for select using (true);

-- Admin write
create policy "Admins manage usps" on public.usps for all to authenticated using (is_admin()) with check (is_admin());
create policy "Admins manage reviews" on public.reviews for all to authenticated using (is_admin()) with check (is_admin());
create policy "Admins manage gallery" on public.gallery_images for all to authenticated using (is_admin()) with check (is_admin());
create policy "Admins manage site_info" on public.site_info for all to authenticated using (is_admin()) with check (is_admin());
