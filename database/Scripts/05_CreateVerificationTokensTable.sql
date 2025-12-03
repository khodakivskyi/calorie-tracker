USE calorie_tracker
GO

SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.tables
    WHERE name = 'verification_tokens'
)
BEGIN
    CREATE TABLE verification_tokens (
        id INT IDENTITY PRIMARY KEY,
        user_id INT NOT NULL,
        token NVARCHAR(256) NOT NULL,
        token_type NVARCHAR(50) NOT NULL,
        expires_at DATETIME2 NOT NULL,
        used_at DATETIME2 NULL,
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_verification_tokens_user_id 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_verification_tokens_token'
      AND object_id = OBJECT_ID('verification_tokens')
)
BEGIN
    CREATE INDEX IX_verification_tokens_token ON verification_tokens (token)
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_verification_tokens_user_type'
      AND object_id = OBJECT_ID('verification_tokens')
)
BEGIN
    CREATE INDEX IX_verification_tokens_user_type ON verification_tokens (user_id, token_type)
END

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_verification_tokens_expires_at'
      AND object_id = OBJECT_ID('verification_tokens')
)
BEGIN
    CREATE INDEX IX_verification_tokens_expires_at ON verification_tokens (expires_at)
END
GO

DROP INDEX IF EXISTS IX_users_email_verification_token ON users
GO

IF COL_LENGTH('users', 'email_verification_token') IS NOT NULL OR
   COL_LENGTH('users', 'email_verification_expires') IS NOT NULL
BEGIN
    ALTER TABLE users DROP COLUMN 
        email_verification_token, 
        email_verification_expires
END
GO
