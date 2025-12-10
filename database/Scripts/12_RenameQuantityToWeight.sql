USE calorie_tracker
GO

SET QUOTED_IDENTIFIER ON;
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('meals_dishes') AND name = 'quantity')
BEGIN
    DECLARE @constraintName NVARCHAR(128);
    DECLARE @sql NVARCHAR(MAX);
    
    DECLARE constraint_cursor CURSOR FOR
    SELECT name
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('meals_dishes');
    
    OPEN constraint_cursor;
    FETCH NEXT FROM constraint_cursor INTO @constraintName;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @sql = 'ALTER TABLE meals_dishes DROP CONSTRAINT ' + QUOTENAME(@constraintName);
        EXEC sp_executesql @sql;
        FETCH NEXT FROM constraint_cursor INTO @constraintName;
    END;
    
    CLOSE constraint_cursor;
    DEALLOCATE constraint_cursor;
    
    EXEC sp_rename 'meals_dishes.quantity', 'weight', 'COLUMN';
    PRINT 'Column quantity renamed to weight in meals_dishes table';
END
ELSE
BEGIN
    PRINT 'Column quantity does not exist in meals_dishes table (may already be renamed)';
END
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('meals_dishes') AND name = 'weight')
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID('meals_dishes') AND name = 'CK_meals_dishes_weight')
    BEGIN
        ALTER TABLE meals_dishes
        ADD CONSTRAINT CK_meals_dishes_weight CHECK (weight > 0);
        PRINT 'Recreated CHECK constraint for weight column in meals_dishes table';
    END
END
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dishes_foods') AND name = 'quantity')
BEGIN
    DECLARE @constraintName2 NVARCHAR(128);
    DECLARE @sql2 NVARCHAR(MAX);
    
    DECLARE constraint_cursor2 CURSOR FOR
    SELECT name
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('dishes_foods');
    
    OPEN constraint_cursor2;
    FETCH NEXT FROM constraint_cursor2 INTO @constraintName2;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @sql2 = 'ALTER TABLE dishes_foods DROP CONSTRAINT ' + QUOTENAME(@constraintName2);
        EXEC sp_executesql @sql2;
        FETCH NEXT FROM constraint_cursor2 INTO @constraintName2;
    END;
    
    CLOSE constraint_cursor2;
    DEALLOCATE constraint_cursor2;
    
    EXEC sp_rename 'dishes_foods.quantity', 'weight', 'COLUMN';
    PRINT 'Column quantity renamed to weight in dishes_foods table';
END
ELSE
BEGIN
    PRINT 'Column quantity does not exist in dishes_foods table (may already be renamed)';
END
GO

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dishes_foods') AND name = 'weight')
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID('dishes_foods') AND name = 'CK_dishes_foods_weight')
    BEGIN
        ALTER TABLE dishes_foods
        ADD CONSTRAINT CK_dishes_foods_weight CHECK (weight > 0);
        PRINT 'Recreated CHECK constraint for weight column in dishes_foods table';
    END
END
GO

