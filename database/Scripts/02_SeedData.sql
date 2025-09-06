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

INSERT INTO foods (owner_id, name, calories, carbohydrates, proteins, fats)
VALUES
    (1, 'Яблуко', 52, 13.8, 0.3, 0.2),
    (1, 'Банан', 89, 22.8, 1.1, 0.3),
    (1, 'Курятина', 165, 0, 31, 3.6),
    (1, 'Рис', 130, 28, 2.7, 0.3),
    (1, 'Броколі', 34, 6.6, 2.8, 0.4),
    (2, 'Морква', 41, 9.6, 0.9, 0.2),
    (2, 'Картопля', 77, 17.5, 2, 0.1),
    (2, 'Лосось', 208, 0, 25, 12),
    (3, 'Авокадо', 160, 8.5, 2, 14.7),
    (3, 'Грецький йогурт', 59, 3.6, 10, 0.4);

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

INSERT INTO meals_dishes (meal_id, dish_id)
VALUES
    (1, 4),
    (2, 1),
    (2, 2),
    (3, 3),
    (4, 4);