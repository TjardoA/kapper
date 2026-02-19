-- Enable RLS and add policies for team_members
alter table if exists public.team_members enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public select team') then
    create policy "Public select team" on public.team_members
      for select using (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Admins manage team') then
    create policy "Admins manage team" on public.team_members
      for all to authenticated
      using (is_admin())
      with check (is_admin());
  end if;
end$$;
