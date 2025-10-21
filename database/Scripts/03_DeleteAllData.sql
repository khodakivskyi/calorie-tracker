USE calorie_tracker
GO

PRINT 'Starting data deletion...'
GO

DELETE FROM meals_dishes
PRINT 'Deleted data from meals_dishes table'
GO

DELETE FROM dishes_foods
PRINT 'Deleted data from dishes_foods table'
GO

DELETE FROM nutrients
PRINT 'Deleted data from nutrients table'
GO

DELETE FROM calories
PRINT 'Deleted data from calories table'
GO

DELETE FROM meals
PRINT 'Deleted data from meals table'
GO

DELETE FROM dishes
PRINT 'Deleted data from dishes table'
GO

DELETE FROM foods
PRINT 'Deleted data from foods table'
GO

DELETE FROM images
PRINT 'Deleted data from images table'
GO

DELETE FROM calorie_limits
PRINT 'Deleted data from calorie_limits table'
GO

DELETE FROM users
PRINT 'Deleted data from users table'
GO

DBCC CHECKIDENT ('users', RESEED, 0)
DBCC CHECKIDENT ('calorie_limits', RESEED, 0)
DBCC CHECKIDENT ('images', RESEED, 0)
DBCC CHECKIDENT ('dishes', RESEED, 0)
DBCC CHECKIDENT ('foods', RESEED, 0)
DBCC CHECKIDENT ('calories', RESEED, 0)
DBCC CHECKIDENT ('meals', RESEED, 0)
DBCC CHECKIDENT ('nutrients', RESEED, 0)
GO

PRINT 'All data successfully deleted!'
GO