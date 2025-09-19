USE calorie_tracker
GO

CREATE TABLE sources
(
    id   INT IDENTITY PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE
)
    GO

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
    id                   INT IDENTITY PRIMARY KEY,
    owner_id             INT NOT NULL REFERENCES users,
    file_name            NVARCHAR(255) NOT NULL,
    created_at           DATETIME2 DEFAULT GETDATE(),
    cloudinary_url       NVARCHAR(500) NOT NULL,
    cloudinary_public_id NVARCHAR(255) NOT NULL
)
    GO

CREATE TABLE dishes
(
    id         INT IDENTITY PRIMARY KEY,
    owner_id   INT NOT NULL REFERENCES users ON DELETE CASCADE,
    name       NVARCHAR(255) NOT NULL,
    weight     DECIMAL(10, 2) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    image_id   INT REFERENCES images
)
    GO

CREATE INDEX IX_dishes_owner_id ON dishes (owner_id)
    GO

CREATE TABLE foods
(
    id          INT IDENTITY PRIMARY KEY,
    owner_id    INT NOT NULL REFERENCES users ON DELETE CASCADE,
    name        NVARCHAR(255) NOT NULL,
    image_id    INT REFERENCES images,
    created_at  DATETIME2 DEFAULT GETDATE(),
    source      INT REFERENCES sources,
    external_id NVARCHAR(100)
)
    GO

CREATE TABLE calories
(
    id       INT IDENTITY PRIMARY KEY,
    calories DECIMAL(10, 2) NOT NULL,
    food_id  INT NOT NULL REFERENCES foods ON DELETE CASCADE
)
    GO

CREATE TABLE dishes_foods
(
    dish_id  INT NOT NULL REFERENCES dishes,
    food_id  INT NOT NULL REFERENCES foods,
    quantity DECIMAL(10, 2) DEFAULT 1.0 NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (dish_id, food_id)
)
    GO

CREATE INDEX IX_dishes_foods_dish_id ON dishes_foods (dish_id)
CREATE INDEX IX_foods_owner_id ON foods (owner_id)
    GO

CREATE TABLE meals
(
    id         INT IDENTITY PRIMARY KEY,
    owner_id   INT NOT NULL REFERENCES users ON DELETE CASCADE,
    name       NVARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
)
    GO

CREATE INDEX IX_meals_owner_id ON meals (owner_id)
    GO

CREATE TABLE meals_dishes
(
    meal_id  INT NOT NULL REFERENCES meals,
    dish_id  INT NOT NULL REFERENCES dishes,
    quantity DECIMAL(10, 2) DEFAULT 1.0 NOT NULL,
    PRIMARY KEY (meal_id, dish_id)
)
    GO

CREATE INDEX IX_meals_dishes_meal_id ON meals_dishes (meal_id)
    GO

CREATE TABLE nutrients
(
    id            INT IDENTITY PRIMARY KEY,
    protein       DECIMAL(10, 2) NOT NULL,
    fat           DECIMAL(10, 2) NOT NULL,
    carbohydrates DECIMAL(10, 2) NOT NULL,
    food_id       INT NOT NULL REFERENCES foods ON DELETE CASCADE
)
    GO