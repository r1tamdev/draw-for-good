insert into charities (name, description, image_url, is_spotlighted) values
  ('Coastal Wildlife Trust', 'Protects coastal habitats and marine wildlife.', 'https://images.unsplash.com/photo-1518398046578-8cca57782e17', true),
  ('Youth Literacy Fund', 'Provides books and reading programs to underserved schools.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570', true),
  ('Green City Initiative', 'Funds urban tree planting and green space restoration.', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735', false),
  ('Meals for Elders', 'Delivers meals to isolated senior citizens.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433', false);

insert into draws (draw_month, mode, status, drawn_numbers, total_pool, pool_5, pool_4, pool_3, jackpot_rollover, published_at) values
  ('2026-02-01', 'random', 'published', array[3, 11, 19, 27, 41], 6000, 2400, 2100, 1500, 0, now() - interval '30 days');