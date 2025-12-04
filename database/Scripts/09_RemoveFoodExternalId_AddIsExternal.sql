USE calorie_tracker
GO

IF EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_foods_external_id'
      AND object_id = OBJECT_ID('foods')
)
BEGIN
    DROP INDEX IX_foods_external_id ON foods;
END
GO

IF COL_LENGTH('foods', 'external_id') IS NOT NULL
BEGIN
    ALTER TABLE foods
    DROP COLUMN external_id;
END
GO

IF COL_LENGTH('foods', 'is_external') IS NULL
BEGIN
    ALTER TABLE foods
    ADD is_external BIT NOT NULL CONSTRAINT DF_foods_is_external DEFAULT 0;
END
GO

