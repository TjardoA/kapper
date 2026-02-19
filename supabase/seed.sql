-- Wipe existing data (local dev only)
truncate table public.services cascade;
truncate table public.team_members cascade;
truncate table public.opening_hours cascade;
truncate table public.usps cascade;
truncate table public.reviews cascade;
truncate table public.gallery_images cascade;
truncate table public.site_info cascade;

-- Site info
insert into public.site_info
  (id, address, phone, whatsapp, maps_url, hero_tagline, hero_title, hero_subtitle, booking_url)
values
  (1,
   'Van Stolberglaan 33, 2713 ES Zoetermeer',
   '0793168787',
   '31793168787',
   'https://www.google.com/maps?q=Bij+Mijn+Kapper+Zoetermeer&output=embed',
   '#alsjehaarmaargoedzit',
   'Modern haircraft voor wie verzorgd én relaxed de salon uit wil.',
   'Wij werken met tijd voor jou: persoonlijk advies, zachte kleuringen en styling die dagen meegaat. Boek direct online of loop binnen voor een korte consult.',
   'https://widget2.meetaimy.com/widgetWeb?salonId=NDk4ODY4&salonEmail=YWZzcHJha2VuQGJpam1pam5rYXBwZXIubmw%3D'
  );

-- Services
insert into public.services (name, description, price, duration) values
  ('Knippen & Stylen', 'Persoonlijk advies, frisse coupe en föhnfinish die past bij jouw haar en lifestyle.', 32, 45),
  ('Kleuren & Highlights', 'Zachte balayage, glansvolle tint of volledige kleurbehandeling met premium producten.', 55, 90),
  ('Treatment Rituals', 'Intens herstellende treatments die glans, hydratatie en veerkracht terugbrengen.', 29, 30);

-- Team
insert into public.team_members (name, bio, image_url) values
  ('Sanne', 'Bekend om natuurlijke blends en glansvolle finishes.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'),
  ('Milan', 'Strakke fades, zachte layers en advies op maat.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'),
  ('Lotte', 'Updo''s en glossy styling voor je mooiste momenten.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80');

-- Opening hours (order Ma-Zo)
insert into public.opening_hours (day, open_time, close_time) values
  ('Maandag',    '09:00', '17:30'),
  ('Dinsdag',    '09:00', '17:30'),
  ('Woensdag',   '09:00', '17:30'),
  ('Donderdag',  '09:00', '17:30'),
  ('Vrijdag',    '09:00', '18:00'),
  ('Zaterdag',   '09:00', '17:00');

-- USP's
insert into public.usps (text, position) values
  ('KEUNE stylingspartner & premium care', 0),
  ('Online boeken in 30 seconden', 1),
  ('Gratis intake en kleuradvies', 2),
  ('Persoonlijke nazorg tips', 3);

-- Reviews (sample)
insert into public.reviews (name, text, rating) values
  ('Noor', 'Eindelijk een kapper die echt luistert. Mijn balayage blijft wekenlang mooi.', 5),
  ('Daan', 'Super service, fijne sfeer en goede styling tips voor thuis.', 5),
  ('Lisa', 'Online afspraak maken gaat soepel en ik ben altijd op tijd aan de beurt.', 5);

-- Gallery
insert into public.gallery_images (url, position) values
  ('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80', 0),
  ('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80', 1),
  ('https://images.unsplash.com/photo-1500856056008-859079534e9e?auto=format&fit=crop&w=700&q=80', 2),
  ('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80', 3);
