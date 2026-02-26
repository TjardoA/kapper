alter table public.team_members
  add column if not exists focal_y numeric default 50 check (focal_y between 0 and 100);
