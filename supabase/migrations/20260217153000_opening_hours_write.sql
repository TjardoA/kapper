-- Allow anon to insert/update/delete opening hours
create policy "anon_insert_opening_hours"
on public.opening_hours
for insert
to anon
with check (true);

create policy "anon_update_opening_hours"
on public.opening_hours
for update
to anon
using (true)
with check (true);

create policy "anon_delete_opening_hours"
on public.opening_hours
for delete
to anon
using (true);