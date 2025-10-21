USE calorie_tracker
GO

PRINT 'Starting to drop all tables...'
GO

IF OBJECT_ID('meals_dishes', 'U') IS NOT NULL
    DROP TABLE meals_dishes
PRINT 'Dropped table: meals_dishes'
GO

IF OBJECT_ID('dishes_foods', 'U') IS NOT NULL
    DROP TABLE dishes_foods
PRINT 'Dropped table: dishes_foods'
GO

IF OBJECT_ID('nutrients', 'U') IS NOT NULL
    DROP TABLE nutrients
PRINT 'Dropped table: nutrients'
GO

IF OBJECT_ID('calories', 'U') IS NOT NULL
    DROP TABLE calories
PRINT 'Dropped table: calories'
GO

IF OBJECT_ID('meals', 'U') IS NOT NULL
    DROP TABLE meals
PRINT 'Dropped table: meals'
GO

IF OBJECT_ID('dishes', 'U') IS NOT NULL
    DROP TABLE dishes
PRINT 'Dropped table: dishes'
GO

IF OBJECT_ID('foods', 'U') IS NOT NULL
    DROP TABLE foods
PRINT 'Dropped table: foods'
GO

IF OBJECT_ID('images', 'U') IS NOT NULL
    DROP TABLE images
PRINT 'Dropped table: images'
GO

IF OBJECT_ID('calorie_limits', 'U') IS NOT NULL
    DROP TABLE calorie_limits
PRINT 'Dropped table: calorie_limits'
GO

IF OBJECT_ID('users', 'U') IS NOT NULL
    DROP TABLE users
PRINT 'Dropped table: users'
GO

IF OBJECT_ID('sources', 'U') IS NOT NULL
    DROP TABLE sources
PRINT 'Dropped table: sources'
GO

PRINT 'All tables dropped successfully!'
GO

