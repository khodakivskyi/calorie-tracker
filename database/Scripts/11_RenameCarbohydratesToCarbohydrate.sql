USE calorie_tracker
GO

DECLARE @constraintName NVARCHAR(128);
SELECT @constraintName = name
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID('nutrients')
  AND definition LIKE '%carbohydrates%';

IF @constraintName IS NOT NULL
BEGIN
    EXEC('ALTER TABLE nutrients DROP CONSTRAINT ' + @constraintName);
END
GO

IF COL_LENGTH('nutrients', 'carbohydrates') IS NOT NULL
BEGIN
    EXEC sp_rename 'nutrients.carbohydrates', 'carbohydrate', 'COLUMN';
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID('nutrients')
      AND definition LIKE '%carbohydrate >= 0%'
)
BEGIN
    ALTER TABLE nutrients
    ADD CONSTRAINT CK_nutrients_carbohydrate CHECK (carbohydrate >= 0);
END
GO

