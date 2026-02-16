-- Services table
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  duration integer not null,
  created_at timestamp with time zone default now()
);

-- Team members table
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Opening hours table
create table public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  open_time time not null,
  close_time time not null
);

-- Appointments table
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete cascade,
  name text not null,
  email text not null,
  appointment_date timestamp with time zone not null,
  status text default 'pending',
  created_at timestamp with time zone default now()
);
