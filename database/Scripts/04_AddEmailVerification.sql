USE calorie_tracker
GO

SET QUOTED_IDENTIFIER ON;
GO

IF COL_LENGTH('users', 'email_confirmed') IS NULL
BEGIN
    ALTER TABLE users 
    ADD email_confirmed BIT NOT NULL DEFAULT 0;
END
GO

IF COL_LENGTH('users', 'email_verification_token') IS NULL
BEGIN
    ALTER TABLE users 
    ADD email_verification_token NVARCHAR(256) NULL;
END
GO

IF COL_LENGTH('users', 'email_verification_expires') IS NULL
BEGIN
    ALTER TABLE users 
    ADD email_verification_expires DATETIME2 NULL;
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_users_email_verification_token'
      AND object_id = OBJECT_ID('users')
)
BEGIN
    CREATE INDEX IX_users_email_verification_token 
    ON users (email_verification_token) 
    WHERE email_verification_token IS NOT NULL;
END
GO

