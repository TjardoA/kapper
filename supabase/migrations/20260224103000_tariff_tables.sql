-- Tariff categories and items for the Tarieven page
create table public.tariff_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  position integer default 0,
  created_at timestamptz default now()
);

create table public.tariff_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.tariff_categories(id) on delete cascade,
  name text not null,
  price_numeric numeric,
  price_text text,
  position integer default 0,
  created_at timestamptz default now(),
  constraint tariff_item_price_present check (price_numeric is not null or price_text is not null)
);

create index tariff_items_category_pos_idx on public.tariff_items (category_id, position);

-- RLS
alter table public.tariff_categories enable row level security;
alter table public.tariff_items enable row level security;

-- Public read
create policy select_tariff_categories_public on public.tariff_categories for select using (true);
create policy select_tariff_items_public on public.tariff_items for select using (true);

-- Admin full access
create policy admin_all_tariff_categories on public.tariff_categories
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy admin_all_tariff_items on public.tariff_items
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Dev/anon writes (to match other CMS tables in local dev)
create policy anon_insert_tariff_categories on public.tariff_categories for insert to anon with check (true);
create policy anon_update_tariff_categories on public.tariff_categories for update to anon using (true) with check (true);
create policy anon_delete_tariff_categories on public.tariff_categories for delete to anon using (true);

create policy anon_insert_tariff_items on public.tariff_items for insert to anon with check (true);
create policy anon_update_tariff_items on public.tariff_items for update to anon using (true) with check (true);
create policy anon_delete_tariff_items on public.tariff_items for delete to anon using (true);
