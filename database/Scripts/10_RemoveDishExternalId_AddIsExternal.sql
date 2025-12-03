USE calorie_tracker
GO

SET QUOTED_IDENTIFIER ON;
GO

IF EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_dishes_external_id'
      AND object_id = OBJECT_ID('dishes')
)
BEGIN
DROP INDEX IX_dishes_external_id ON dishes;
END
GO

IF COL_LENGTH('dishes', 'external_id') IS NOT NULL
BEGIN
ALTER TABLE dishes
DROP COLUMN external_id;
END
GO

IF COL_LENGTH('dishes', 'is_external') IS NULL
BEGIN
ALTER TABLE dishes
    ADD is_external BIT NOT NULL CONSTRAINT DF_dishes_is_external DEFAULT 0;
END
GO