alter table public.gallery_images
  add column if not exists focal_x numeric default 50 check (focal_x between 0 and 100),
  add column if not exists focal_y numeric default 50 check (focal_y between 0 and 100);
