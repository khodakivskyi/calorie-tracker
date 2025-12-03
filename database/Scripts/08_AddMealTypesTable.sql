USE calorie_tracker
GO

SET QUOTED_IDENTIFIER ON;
GO

CREATE TABLE meal_types
(
    id            INT IDENTITY PRIMARY KEY,
    name          NVARCHAR(50) NOT NULL
)
GO

INSERT INTO meal_types (name) VALUES
('Breakfast'),
('Lunch'),
('Dinner'),
('Snack'),
('Custom')
GO

ALTER TABLE meals
    ADD meal_type_id INT NOT NULL DEFAULT 5 REFERENCES meal_types(id)
GO

CREATE UNIQUE INDEX UX_Meals_SystemTypes
    ON meals(owner_id, created_at, meal_type_id)
    WHERE meal_type_id IN (1, 2, 3, 4);
GO