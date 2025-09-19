USE calorie_tracker
GO

INSERT INTO users (name, email, password_hash, salt)
VALUES
    ('Іван Петренко', 'ivan@example.com', 'a1b2c3d4e5f6', 'salt123'),
    ('Марія Коваленко', 'maria@example.com', 'f6e5d4c3b2a1', 'salt456'),
    ('Олексій Сидоренко', 'oleksiy@example.com', '1a2b3c4d5e6f', 'salt789');

INSERT INTO calorie_limits (user_id, limit_value, created_at)
VALUES
    (1, 2000.00, '2024-01-01 00:00:00'),
    (2, 1800.00, '2024-01-01 00:00:00'),
    (3, 2200.00, '2024-01-01 00:00:00');

INSERT INTO foods (owner_id, name, source, external_id)
VALUES
    (1, 'Яблуко', 1, 'USDA_001'),
    (1, 'Банан', 1, 'USDA_002'),
    (1, 'Курятина', 2, 'LOCAL_001'),
    (1, 'Рис', 1, 'USDA_003'),
    (1, 'Броколі', 2, 'LOCAL_002'),
    (2, 'Морква', 2, 'LOCAL_003'),
    (2, 'Картопля', 2, 'LOCAL_004'),
    (2, 'Лосось', 3, 'IMPORT_001'),
    (3, 'Авокадо', 3, 'IMPORT_002'),
    (3, 'Грецький йогурт', 2, 'LOCAL_005');

INSERT INTO calories (food_id, calories)
VALUES
    (1, 52.00),
    (2, 89.00),
    (3, 165.00),
    (4, 130.00),
    (5, 34.00),
    (6, 41.00),
    (7, 77.00),
    (8, 208.00),
    (9, 160.00),
    (10, 59.00);

INSERT INTO nutrients (food_id, protein, fat, carbohydrates)
VALUES
    (1, 0.30, 0.20, 13.80),
    (2, 1.10, 0.30, 22.80),
    (3, 31.00, 3.60, 0.00),
    (4, 2.70, 0.30, 28.00),
    (5, 2.80, 0.40, 6.60),
    (6, 0.90, 0.20, 9.60),
    (7, 2.00, 0.10, 17.50),
    (8, 25.00, 12.00, 0.00),
    (9, 2.00, 14.70, 8.50),
    (10, 10.00, 0.40, 3.60);

INSERT INTO dishes (owner_id, name, weight, created_at)
VALUES
    (1, 'Куряча грудка з рисом', 300.00, '2024-01-15 12:00:00'),
    (1, 'Салат з броколі', 200.00, '2024-01-15 12:30:00'),
    (2, 'Лосось з картоплею', 400.00, '2024-01-16 13:00:00'),
    (3, 'Авокадо тост', 150.00, '2024-01-17 09:00:00');

INSERT INTO dishes_foods (dish_id, food_id, quantity)
VALUES
    (1, 3, 150.00),
    (1, 4, 100.00),
    (2, 5, 200.00),
    (3, 8, 200.00),
    (3, 7, 200.00),
    (4, 9, 100.00),
    (4, 10, 50.00);

INSERT INTO meals (owner_id, name, created_at)
VALUES
    (1, 'Сніданок', '2024-01-15 08:00:00'),
    (1, 'Обід', '2024-01-15 13:00:00'),
    (2, 'Вечеря', '2024-01-16 19:00:00'),
    (3, 'Сніданок', '2024-01-17 09:30:00');

INSERT INTO meals_dishes (meal_id, dish_id, quantity)
VALUES
    (1, 4, 1.00),
    (2, 1, 1.00),
    (2, 2, 1.00),
    (3, 3, 1.00),
    (4, 4, 1.00);