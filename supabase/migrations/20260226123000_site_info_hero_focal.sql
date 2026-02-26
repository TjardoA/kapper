alter table public.site_info
  add column if not exists hero_focal_x numeric default 50 check (hero_focal_x between 0 and 100),
  add column if not exists hero_focal_y numeric default 50 check (hero_focal_y between 0 and 100);
