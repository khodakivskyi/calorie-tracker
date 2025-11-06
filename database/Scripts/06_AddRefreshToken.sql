USE calorie_tracker
GO

ALTER TABLE users 
ADD refresh_token NVARCHAR(256) NULL,
    refresh_token_expires DATETIME2 NULL
GO

CREATE INDEX IX_users_refresh_token ON users (refresh_token)
WHERE refresh_token IS NOT NULL
GO

