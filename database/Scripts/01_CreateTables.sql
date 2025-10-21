USE calorie_tracker
GO

-- CREATE TABLES
CREATE TABLE users
(
    id            INT IDENTITY PRIMARY KEY,
    name          NVARCHAR(255),
    email         NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    salt          NVARCHAR(255) NOT NULL
)
GO

CREATE TABLE calorie_limits
(
    id          INT IDENTITY PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users ON DELETE CASCADE,
    limit_value DECIMAL(10, 2) NOT NULL CHECK (limit_value > 0),
    created_at  DATETIME2 DEFAULT GETDATE()
)
GO

CREATE TABLE images
(
    id         INT IDENTITY PRIMARY KEY,
    owner_id   INT REFERENCES users ON DELETE CASCADE,
    file_name  NVARCHAR(255) NOT NULL,
    url        NVARCHAR(500) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    external_id NVARCHAR(50)
)
GO

CREATE TABLE dishes
(
    id          INT IDENTITY PRIMARY KEY,
    owner_id   INT REFERENCES users ON DELETE CASCADE,
    name       NVARCHAR(255) NOT NULL,
    weight     DECIMAL(10, 2) NOT NULL CHECK (weight > 0),
    created_at DATETIME2 DEFAULT GETDATE(),
    image_id   INT REFERENCES images,
    external_id NVARCHAR(50)
)
GO

CREATE TABLE foods
(
    id          INT IDENTITY PRIMARY KEY,
    owner_id    INT REFERENCES users ON DELETE CASCADE,
    name        NVARCHAR(255) NOT NULL,
    image_id    INT REFERENCES images,
    created_at  DATETIME2 DEFAULT GETDATE(),
    external_id NVARCHAR(50)
)
GO

CREATE TABLE calories
(
    food_id  INT PRIMARY KEY REFERENCES foods ON DELETE CASCADE,
    calories DECIMAL(10, 2) NOT NULL CHECK (calories >= 0)
)
GO

CREATE TABLE nutrients
(
    food_id       INT PRIMARY KEY REFERENCES foods ON DELETE CASCADE,
    protein       DECIMAL(10, 2) NOT NULL CHECK (protein >= 0),
    fat           DECIMAL(10, 2) NOT NULL CHECK (fat >= 0),
    carbohydrates DECIMAL(10, 2) NOT NULL CHECK (carbohydrates >= 0)
)
GO

CREATE TABLE dishes_foods
(
    dish_id  INT NOT NULL REFERENCES dishes ON DELETE CASCADE,
    food_id  INT NOT NULL REFERENCES foods,
    quantity DECIMAL(10, 2) DEFAULT 1.0 NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (dish_id, food_id)
)
GO

CREATE TABLE meals
(
    id         INT IDENTITY PRIMARY KEY,
    owner_id   INT NOT NULL REFERENCES users ON DELETE CASCADE,
    name       NVARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
)
GO

CREATE TABLE meals_dishes
(
    meal_id  INT NOT NULL REFERENCES meals ON DELETE CASCADE,
    dish_id  INT NOT NULL REFERENCES dishes,
    quantity DECIMAL(10, 2) DEFAULT 1.0 NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (meal_id, dish_id)
)
GO

-- CREATE INDEXES
CREATE INDEX IX_calorie_limits_user_id ON calorie_limits (user_id)
CREATE INDEX IX_images_owner_id ON images (owner_id)
CREATE INDEX IX_dishes_owner_id ON dishes (owner_id)
CREATE INDEX IX_foods_owner_id ON foods (owner_id)
CREATE INDEX IX_meals_owner_id ON meals (owner_id)
GO

CREATE INDEX IX_dishes_foods_dish_id ON dishes_foods (dish_id)
CREATE INDEX IX_dishes_foods_food_id ON dishes_foods (food_id)
CREATE INDEX IX_meals_dishes_meal_id ON meals_dishes (meal_id)
CREATE INDEX IX_meals_dishes_dish_id ON meals_dishes (dish_id)
GO

CREATE UNIQUE INDEX IX_foods_external_id ON foods (external_id) WHERE external_id IS NOT NULL
CREATE UNIQUE INDEX IX_dishes_external_id ON dishes (external_id) WHERE external_id IS NOT NULL
CREATE UNIQUE INDEX IX_images_external_id ON images (external_id) WHERE external_id IS NOT NULL
GO