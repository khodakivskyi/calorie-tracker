USE calorie_tracker
GO

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
GO

CREATE INDEX IX_verification_tokens_token ON verification_tokens (token)
CREATE INDEX IX_verification_tokens_user_type ON verification_tokens (user_id, token_type)
CREATE INDEX IX_verification_tokens_expires_at ON verification_tokens (expires_at)
GO

DROP INDEX IF EXISTS IX_users_email_verification_token ON users
GO

ALTER TABLE users DROP COLUMN email_verification_token, email_verification_expires
GO
