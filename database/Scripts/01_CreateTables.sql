use calorie_tracker
go

create table users
(
    id            int identity
        primary key,
    name          nvarchar(255),
    email         nvarchar(255) not null
        unique
        constraint UQ_users_email
            unique,
    password_hash nvarchar(255) not null,
    salt          nvarchar(255) not null
)
    go

create table calorie_limits
(
    id          int identity
        primary key,
    user_id     int            not null
        references users
            on delete cascade,
    limit_value decimal(10, 2) not null
        constraint CHK_limit_positive
            check ([limit_value] > 0),
    created_at  datetime2 default getdate()
)
    go

create table images
(
    id         int identity
        primary key,
    owner_id   int           not null
        references users,
    file_name  nvarchar(255) not null,
    file_path  nvarchar(500) not null,
    file_size  int           not null,
    mime_type  nvarchar(100) not null,
    created_at datetime2 default getdate()
)
    go

create table foods
(
    id       int identity
        primary key,
    owner_id int           not null
        references users
            on delete cascade,
    name     nvarchar(255) not null,
    image_id int
        references images
)
    go

create table dishes
(
    id         int identity
        primary key,
    owner_id   int            not null
        references users
            on delete cascade,
    name       nvarchar(255)  not null,
    weight     decimal(10, 2) not null,
    created_at datetime2 default getdate(),
    image_id   int
        references images
)
    go

create table meals
(
    id         int identity
        primary key,
    owner_id   int           not null
        references users
            on delete cascade,
    name       nvarchar(255) not null,
    created_at datetime2 default getdate()
)
    go

create table calories
(
    id       int identity
        primary key,
    calories decimal(10, 2) not null
        constraint CHK_calories_positive
            check ([calories] >= 0),
    food_id  int
        references foods,
    dish_id  int
        references dishes,
    constraint check_calorie_reference
        check ([food_id] IS NOT NULL AND [dish_id] IS NULL OR [food_id] IS NULL AND [dish_id] IS NOT NULL)
)
    go

create table nutrients
(
    id            int identity
        primary key,
    carbohydrates decimal(10, 2),
    proteins      decimal(10, 2),
    fats          decimal(10, 2),
    food_id       int
        references foods,
    dish_id       int
        references dishes,
    constraint check_nutrient_reference
        check ([food_id] IS NOT NULL AND [dish_id] IS NULL OR [food_id] IS NULL AND [dish_id] IS NOT NULL)
    )
    go

create table dishes_foods
(
    dish_id    int                        not null
        references dishes,
    food_id    int                        not null
        references foods,
    quantity   decimal(10, 2) default 1.0 not null
        constraint CHK_quantity_positive
            check ([quantity] > 0),
    created_at datetime2      default getdate(),
    primary key (dish_id, food_id)
)
    go

create table meals_dishes
(
    meal_id int not null
        references meals,
    dish_id int not null
        references dishes,
    primary key (meal_id, dish_id)
)
    go

create index IX_foods_owner_id on foods (owner_id)
    go

create index IX_dishes_owner_id on dishes (owner_id)
    go

create index IX_meals_owner_id on meals (owner_id)
    go

create index IX_dishes_foods_dish_id on dishes_foods (dish_id)
    go

create index IX_meals_dishes_meal_id on meals_dishes (meal_id)
    go