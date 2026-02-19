alter table if exists public.site_info
  add column if not exists booking_url text;

-- Optional: set default to current widget so existing data keeps working
update public.site_info
set booking_url = coalesce(
  booking_url,
  'https://widget2.meetaimy.com/widgetWeb?salonId=NDk4ODY4&salonEmail=YWZzcHJha2VuQGJpam1pam5rYXBwZXIubmw%3D'
);

