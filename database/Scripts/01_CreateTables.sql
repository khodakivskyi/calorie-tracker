USE calorie_tracker
GO

CREATE TABLE dbo.users
(
    id            INT IDENTITY PRIMARY KEY,
    name          NVARCHAR(255),
    email         NVARCHAR(255) NOT NULL UNIQUE CONSTRAINT UQ_users_email UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    salt          NVARCHAR(255) NOT NULL
)
    GO

CREATE TABLE dbo.calorie_limits
(
    id          INT IDENTITY PRIMARY KEY,
    user_id     INT            NOT NULL REFERENCES dbo.users ON DELETE CASCADE,
    limit_value DECIMAL(10, 2) NOT NULL CONSTRAINT CHK_limit_positive CHECK ([limit_value] > 0),
    created_at  DATETIME2 DEFAULT GETDATE()
)
    GO

CREATE TABLE dbo.images
(
    id         INT IDENTITY PRIMARY KEY,
    owner_id   INT           NOT NULL REFERENCES dbo.users,
    file_name  NVARCHAR(255) NOT NULL,
    file_path  NVARCHAR(500) NOT NULL,
    file_size  INT           NOT NULL,
    mime_type  NVARCHAR(100) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
)
    GO

CREATE TABLE dbo.dishes
(
    id         INT IDENTITY PRIMARY KEY,
    owner_id   INT            NOT NULL REFERENCES dbo.users ON DELETE CASCADE,
    name       NVARCHAR(255)  NOT NULL,
    weight     DECIMAL(10, 2) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    image_id   INT REFERENCES dbo.images
)
    GO

CREATE INDEX IX_dishes_owner_id ON dbo.dishes (owner_id)
    GO

CREATE TABLE dbo.foods
(
    id            INT IDENTITY PRIMARY KEY,
    owner_id      INT           NOT NULL REFERENCES dbo.users ON DELETE CASCADE,
    name          NVARCHAR(255) NOT NULL,
    image_id      INT REFERENCES dbo.images,
    calories      DECIMAL(10, 2) NULL,
    carbohydrates DECIMAL(10, 2) NULL,
    proteins      DECIMAL(10, 2) NULL,
    fats          DECIMAL(10, 2) NULL,
    created_at    DATETIME2 DEFAULT GETDATE()
)
    GO

CREATE TABLE dbo.dishes_foods
(
    dish_id  INT                        NOT NULL REFERENCES dbo.dishes,
    food_id  INT                        NOT NULL REFERENCES dbo.foods,
    quantity DECIMAL(10, 2) DEFAULT 1.0 NOT NULL CONSTRAINT CHK_quantity_positive CHECK ([quantity] > 0),
    primary key (dish_id, food_id)
)
    GO

CREATE INDEX IX_dishes_foods_dish_id ON dbo.dishes_foods (dish_id)
    GO

CREATE INDEX IX_foods_owner_id ON dbo.foods (owner_id)
    GO

CREATE TABLE dbo.meals
(
    id         INT IDENTITY PRIMARY KEY,
    owner_id   INT           NOT NULL REFERENCES dbo.users ON DELETE CASCADE,
    name       NVARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
)
    GO

CREATE INDEX IX_meals_owner_id ON dbo.meals (owner_id)
    GO

CREATE TABLE dbo.meals_dishes
(
    meal_id  INT                        NOT NULL REFERENCES dbo.meals,
    dish_id  INT                        NOT NULL REFERENCES dbo.dishes,
    quantity DECIMAL(10, 2) DEFAULT 1.0 NOT NULL,
    primary key (meal_id, dish_id)
)
    GO

CREATE INDEX IX_meals_dishes_meal_id ON dbo.meals_dishes (meal_id)
    GO