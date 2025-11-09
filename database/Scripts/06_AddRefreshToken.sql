USE calorie_tracker
GO

IF COL_LENGTH('users', 'refresh_token') IS NULL
BEGIN
    ALTER TABLE users 
    ADD refresh_token NVARCHAR(256) NULL;
END

IF COL_LENGTH('users', 'refresh_token_expires') IS NULL
BEGIN
    ALTER TABLE users 
    ADD refresh_token_expires DATETIME2 NULL;
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_users_refresh_token'
      AND object_id = OBJECT_ID('users')
)
BEGIN
    CREATE INDEX IX_users_refresh_token ON users (refresh_token)
    WHERE refresh_token IS NOT NULL
END
GO

