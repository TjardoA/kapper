-- Allow anon writes for CMS tables (dev/local)

-- services
create policy "anon_insert_services" on public.services for insert to anon with check (true);
create policy "anon_update_services" on public.services for update to anon using (true) with check (true);
create policy "anon_delete_services" on public.services for delete to anon using (true);

-- team_members
create policy "anon_insert_team_members" on public.team_members for insert to anon with check (true);
create policy "anon_update_team_members" on public.team_members for update to anon using (true) with check (true);
create policy "anon_delete_team_members" on public.team_members for delete to anon using (true);

-- reviews
create policy "anon_insert_reviews" on public.reviews for insert to anon with check (true);
create policy "anon_update_reviews" on public.reviews for update to anon using (true) with check (true);
create policy "anon_delete_reviews" on public.reviews for delete to anon using (true);

-- gallery_images
create policy "anon_insert_gallery_images" on public.gallery_images for insert to anon with check (true);
create policy "anon_update_gallery_images" on public.gallery_images for update to anon using (true) with check (true);
create policy "anon_delete_gallery_images" on public.gallery_images for delete to anon using (true);

-- site_info
create policy "anon_insert_site_info" on public.site_info for insert to anon with check (true);
create policy "anon_update_site_info" on public.site_info for update to anon using (true) with check (true);
create policy "anon_delete_site_info" on public.site_info for delete to anon using (true);

-- usps
create policy "anon_insert_usps" on public.usps for insert to anon with check (true);
create policy "anon_update_usps" on public.usps for update to anon using (true) with check (true);
create policy "anon_delete_usps" on public.usps for delete to anon using (true);

-- appointments
create policy "anon_insert_appointments" on public.appointments for insert to anon with check (true);
create policy "anon_update_appointments" on public.appointments for update to anon using (true) with check (true);
create policy "anon_delete_appointments" on public.appointments for delete to anon using (true);