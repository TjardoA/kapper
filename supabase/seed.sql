-- =====================================================
-- WIPE (alleen voor local reset)
-- =====================================================

truncate table public.tariff_items cascade;
truncate table public.tariff_categories cascade;
truncate table public.services cascade;
truncate table public.team_members cascade;
truncate table public.opening_hours cascade;
truncate table public.usps cascade;
truncate table public.reviews cascade;
truncate table public.gallery_images cascade;
truncate table public.site_info cascade;



-- =====================================================
-- SITE INFO (UUID singleton - GEEN id meegeven)
-- =====================================================

insert into public.site_info
  (address, phone, whatsapp, maps_url, hero_tagline, hero_title, hero_subtitle, booking_url, about_title, about_body, hero_image_url)
values
  (
   'Van Stolberglaan 33, 2713 ES Zoetermeer',
   '0793168787',
   '31793168787',
   'https://www.google.com/maps?q=Bij+Mijn+Kapper+Zoetermeer&output=embed',
   '#alsjehaarmaargoedzit',
   'Modern haircraft voor wie verzorgd en relaxed de salon uit wil.',
   'Wij werken met tijd voor jou: persoonlijk advies, zachte kleuringen en styling die dagen meegaat. Boek direct online of loop binnen voor een korte consult.',
   'https://widget2.meetaimy.com/widgetWeb?salonId=NDk4ODY4&salonEmail=YWZzcHJha2VuQGJpam1pam5rYXBwZXIubmw%3D',
   'Een salon die voelt als thuiskomen',
   'We plannen ruim de tijd, zodat we echt luisteren en adviseren. Met premium producten en technieken die het haar gezond houden.',
   'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=80'
  );



-- =====================================================
-- SERVICES
-- =====================================================

insert into public.services (name, description, price, duration) values
  ('Knippen & Stylen', 'Persoonlijk advies, frisse coupe en föhnfinish die past bij jouw haar en lifestyle.', 32, 45),
  ('Kleuren & Highlights', 'Zachte balayage, glansvolle tint of volledige kleurbehandeling met premium producten.', 55, 90),
  ('Treatment Rituals', 'Intens herstellende treatments die glans, hydratatie en veerkracht terugbrengen.', 29, 30);



-- =====================================================
-- TEAM
-- =====================================================

insert into public.team_members (name, bio, image_url) values
  ('Sanne', 'Bekend om natuurlijke blends en glansvolle finishes.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'),
  ('Milan', 'Strakke fades, zachte layers en advies op maat.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'),
  ('Lotte', 'Updo's en glossy styling voor je mooiste momenten.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80');



-- =====================================================
-- OPENING HOURS
-- =====================================================

insert into public.opening_hours (day, open_time, close_time) values
  ('Maandag',    '09:00', '17:30'),
  ('Dinsdag',    '09:00', '17:30'),
  ('Woensdag',   '09:00', '17:30'),
  ('Donderdag',  '09:00', '17:30'),
  ('Vrijdag',    '09:00', '18:00'),
  ('Zaterdag',   '09:00', '17:00');



-- =====================================================
-- USP'S
-- =====================================================

insert into public.usps (text, position) values
  ('KEUNE stylingspartner & premium care', 0),
  ('Online boeken in 30 seconden', 1),
  ('Gratis intake en kleuradvies', 2),
  ('Persoonlijke nazorg tips', 3);



-- =====================================================
-- REVIEWS
-- =====================================================

insert into public.reviews (name, text, rating) values
  ('Noor', 'Eindelijk een kapper die echt luistert. Mijn balayage blijft wekenlang mooi.', 5),
  ('Daan', 'Super service, fijne sfeer en goede styling tips voor thuis.', 5),
  ('Lisa', 'Online afspraak maken gaat soepel en ik ben altijd op tijd aan de beurt.', 5);



-- =====================================================
-- GALLERY
-- =====================================================

insert into public.gallery_images (url, position) values
  ('https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80', 0),
  ('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80', 1),
  ('https://images.unsplash.com/photo-1500856056008-859079534e9e?auto=format&fit=crop&w=700&q=80', 2),
  ('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80', 3);



-- =====================================================
-- TARIEVEN (CATEGORIES + ITEMS)
-- UUID SAFE
-- =====================================================

with cats as (
  insert into public.tariff_categories (title, position) values
    ('Dames', 0),
    ('Heren', 1),
    ('Kids', 2),
    ('Kleuring', 3),
    ('Permanent', 4),
    ('Diversen', 5)
  returning id, title
)
insert into public.tariff_items (category_id, name, price_numeric, price_text, position) values

  -- Dames
  ((select id from cats where title = 'Dames'), 'Wassen drogen', 17.50, null, 0),
  ((select id from cats where title = 'Dames'), 'Wassen föhnen', 29.75, null, 1),
  ((select id from cats where title = 'Dames'), 'Wassen knippen', 27.00, null, 2),
  ((select id from cats where title = 'Dames'), 'Wassen knippen drogen', 33.25, null, 3),
  ((select id from cats where title = 'Dames'), 'Wassen knippen föhnen model', 45.25, null, 4),
  ((select id from cats where title = 'Dames'), 'Pony knippen', 10.75, null, 5),
  ((select id from cats where title = 'Dames'), 'Lang haar knippen toeslag', 12.25, null, 6),

  -- Heren
  ((select id from cats where title = 'Heren'), 'Wassen knippen', 25.00, null, 0),
  ((select id from cats where title = 'Heren'), 'Tondeuse', 18.75, null, 1),
  ((select id from cats where title = 'Heren'), 'Contouren', 11.50, null, 2),
  ((select id from cats where title = 'Heren'), 'Baard knippen', 11.50, null, 3),
  ((select id from cats where title = 'Heren'), 'Men's color incl. knippen', 47.50, null, 4),

  -- Kids
  ((select id from cats where title = 'Kids'), 'Tot 10 jaar', 16.75, null, 0),
  ((select id from cats where title = 'Kids'), '10 tot 15 jaar', 18.75, null, 1),

  -- Kleuring
  ((select id from cats where title = 'Kleuring'), 'Advies gesprek', 0, null, 0),
  ((select id from cats where title = 'Kleuring'), 'Kleurspoeling (vanaf)', 35.00, null, 1),
  ((select id from cats where title = 'Kleuring'), 'Kleuring uitgroei 30cc', 37.50, null, 2),
  ((select id from cats where title = 'Kleuring'), 'Kleurtoeslag per 10cc', 7.50, null, 3),
  ((select id from cats where title = 'Kleuring'), 'Kamstrepen', 30.00, null, 4),
  ((select id from cats where title = 'Kleuring'), 'Folies per stuk', 4.00, null, 5),
  ((select id from cats where title = 'Kleuring'), 'Folies 10-15 stuks (vanaf)', 40.00, null, 6),
  ((select id from cats where title = 'Kleuring'), 'Folies 16-30 stuks (vanaf)', 55.00, null, 7),
  ((select id from cats where title = 'Kleuring'), 'Folies 31-50 stuks (hele haar, vanaf)', 75.00, null, 8),
  ((select id from cats where title = 'Kleuring'), 'Toner na kleuring/highlights', 27.50, null, 9),
  ((select id from cats where title = 'Kleuring'), 'Balayage', 135.00, null, 10),

  -- Permanent
  ((select id from cats where title = 'Permanent'), 'Permanent all-in', 89.50, null, 0),
  ((select id from cats where title = 'Permanent'), 'Deel permanent all-in', 79.50, null, 1),
  ((select id from cats where title = 'Permanent'), 'Lang haar toeslag', 20.00, null, 2),

  -- Diversen
  ((select id from cats where title = 'Diversen'), 'Proef en bruidskapsel (samen)', null, 'Op aanvraag', 0),
  ((select id from cats where title = 'Diversen'), 'Extensions', null, 'Op aanvraag', 1);




