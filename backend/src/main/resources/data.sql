-- Levels
INSERT INTO level (id, name, description, order_index, max_anger) VALUES
(1, 'Kitchen', 'The neighbor''s kitchen — pots, pans, and plenty of mischief opportunities', 1, 100),
(2, 'Bathroom', 'Squeaky clean? Not for long...', 2, 100),
(3, 'Living Room', 'Cozy evening? Time to shake things up!', 3, 100);

-- Kitchen Pranks
INSERT INTO prank (id, level_id, name, description, object_name, pos_x, pos_y, anger_points, success_chance) VALUES
(1, 1, 'Swap Salt and Sugar', 'Switch the salt and sugar containers on the counter', 'sugar_bowl', 320, 280, 15, 0.85),
(2, 1, 'Loosen Faucet', 'Loosen the kitchen faucet so it sprays everywhere', 'faucet', 480, 200, 20, 0.70),
(3, 1, 'Grease the Floor', 'Pour cooking oil on the kitchen floor tiles', 'oil_bottle', 200, 350, 25, 0.60),
(4, 1, 'Rewire the Toaster', 'Set the toaster to maximum — burnt toast incoming', 'toaster', 550, 280, 10, 0.90),
(5, 1, 'Cling Wrap the Fridge', 'Cover all the fridge shelves with cling wrap', 'fridge', 100, 250, 30, 0.50);

-- Bathroom Pranks
INSERT INTO prank (id, level_id, name, description, object_name, pos_x, pos_y, anger_points, success_chance) VALUES
(6, 2, 'Swap Shampoo', 'Replace shampoo with hair dye', 'shampoo', 350, 180, 25, 0.65),
(7, 2, 'Clog the Drain', 'Stuff the drain with paper towels', 'drain', 300, 380, 15, 0.80),
(8, 2, 'Slippery Soap', 'Coat the soap bar with clear nail polish', 'soap', 420, 300, 20, 0.75),
(9, 2, 'Toilet Paper Swap', 'Replace toilet paper roll with sandpaper', 'tp_holder', 150, 320, 20, 0.70),
(10, 2, 'Mirror Fog Message', 'Write a spooky message in anti-fog on the mirror', 'mirror', 300, 120, 20, 0.90);

-- Living Room Pranks
INSERT INTO prank (id, level_id, name, description, object_name, pos_x, pos_y, anger_points, success_chance) VALUES
(11, 3, 'Remote Batteries', 'Remove batteries from the TV remote', 'remote', 500, 350, 15, 0.90),
(12, 3, 'Wobbly Chair Leg', 'Loosen one leg of the favorite armchair', 'armchair', 350, 300, 20, 0.70),
(13, 3, 'Itching Powder Cushion', 'Sprinkle itching powder on the couch cushions', 'couch', 300, 320, 25, 0.65),
(14, 3, 'Alarm Clock Hide', 'Hide an alarm clock set to 3 AM behind the bookshelf', 'bookshelf', 100, 200, 30, 0.55),
(15, 3, 'Glue the Pages', 'Glue random pages together in his favorite book', 'book', 150, 350, 15, 0.85);

-- Prank Dependencies (some pranks require others first)
INSERT INTO prank_dependency (prank_id, required_prank_id) VALUES
(3, 1),   -- Grease floor requires salt swap first (need to be in kitchen already)
(5, 2),   -- Cling wrap fridge requires loosened faucet (distraction)
(9, 7),   -- TP swap requires clogged drain (neighbor in other room)
(14, 11); -- Alarm hide requires remote batteries removed (neighbor distracted)
