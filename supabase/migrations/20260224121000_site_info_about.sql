alter table public.site_info
  add column if not exists about_title text,
  add column if not exists about_body text;
