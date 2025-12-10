USE calorie_tracker
GO

SET QUOTED_IDENTIFIER ON;
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('meals_dishes') AND name = 'quantity')
BEGIN
    EXEC sp_rename 'meals_dishes.quantity', 'weight', 'COLUMN';
    PRINT 'Column quantity renamed to weight in meals_dishes table';
END
ELSE
BEGIN
    PRINT 'Column quantity does not exist in meals_dishes table (may already be renamed)';
END
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dishes_foods') AND name = 'quantity')
BEGIN
    EXEC sp_rename 'dishes_foods.quantity', 'weight', 'COLUMN';
    PRINT 'Column quantity renamed to weight in dishes_foods table';
END
ELSE
BEGIN
    PRINT 'Column quantity does not exist in dishes_foods table (may already be renamed)';
END
GO

