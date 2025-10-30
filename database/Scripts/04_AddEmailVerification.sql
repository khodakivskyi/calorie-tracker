USE calorie_tracker
GO

ALTER TABLE users 
ADD email_confirmed BIT NOT NULL DEFAULT 0;
GO

ALTER TABLE users 
ADD email_verification_token NVARCHAR(256) NULL;
GO

ALTER TABLE users 
ADD email_verification_expires DATETIME2 NULL;
GO

CREATE INDEX IX_users_email_verification_token 
ON users (email_verification_token) 
WHERE email_verification_token IS NOT NULL;
GO

