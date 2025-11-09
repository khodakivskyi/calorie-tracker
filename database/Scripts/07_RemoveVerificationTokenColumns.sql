USE calorie_tracker
GO

IF EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_verification_tokens_user_type'
      AND object_id = OBJECT_ID('dbo.verification_tokens')
)
    DROP INDEX IX_verification_tokens_user_type ON dbo.verification_tokens;
GO

IF COL_LENGTH('dbo.verification_tokens', 'token_type') IS NOT NULL
    ALTER TABLE dbo.verification_tokens DROP COLUMN token_type;
GO

IF COL_LENGTH('dbo.verification_tokens', 'used_at') IS NOT NULL
    ALTER TABLE dbo.verification_tokens DROP COLUMN used_at;
GO

