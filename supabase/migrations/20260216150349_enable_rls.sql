-- Enable RLS
alter table public.services enable row level security;
alter table public.team_members enable row level security;
alter table public.opening_hours enable row level security;
alter table public.appointments enable row level security;

-- Public read access
create policy "Public can view services"
on public.services
for select
using (true);

create policy "Public can view team_members"
on public.team_members
for select
using (true);

create policy "Public can view opening_hours"
on public.opening_hours
for select
using (true);
