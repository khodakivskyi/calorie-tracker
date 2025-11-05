using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class TokenRepository : ITokenRepository
    {
        private readonly string _connectionString;

        public TokenRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<VerificationToken?> CreateTokenAsync(int userId, string token, string tokenType, DateTime expiresAt)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO verification_tokens (user_id, token, token_type, expires_at, created_at)
                OUTPUT INSERTED.id, INSERTED.user_id AS UserId, INSERTED.token AS Token, 
                       INSERTED.token_type AS TokenType, INSERTED.expires_at AS ExpiresAt,
                       INSERTED.used_at AS UsedAt, INSERTED.created_at AS CreatedAt
                VALUES (@UserId, @Token, @TokenType, @ExpiresAt, GETUTCDATE())";

            return await connection.QuerySingleOrDefaultAsync<VerificationToken>(sql, new
            {
                UserId = userId,
                Token = token,
                TokenType = tokenType,
                ExpiresAt = expiresAt
            });
        }

        public async Task<VerificationToken?> GetTokenAsync(string token)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, user_id AS UserId, token, token_type AS TokenType, 
                       expires_at AS ExpiresAt, used_at AS UsedAt, created_at AS CreatedAt
                FROM verification_tokens 
                WHERE token = @Token";

            return await connection.QueryFirstOrDefaultAsync<VerificationToken>(sql, new { Token = token });
        }

        public async Task<bool> MarkAsUsedAsync(int tokenId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                UPDATE verification_tokens 
                SET used_at = GETUTCDATE() 
                WHERE id = @Id";

            var affectedRows = await connection.ExecuteAsync(sql, new { Id = tokenId });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteUserTokensAsync(int userId, string tokenType)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                DELETE FROM verification_tokens 
                WHERE user_id = @UserId AND token_type = @TokenType";

            var affectedRows = await connection.ExecuteAsync(sql, new { UserId = userId, TokenType = tokenType });
            return affectedRows > 0;
        }

        public async Task<int> CleanupExpiredTokensAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                DELETE FROM verification_tokens 
                WHERE expires_at < GETUTCDATE()";

            return await connection.ExecuteAsync(sql);
        }
    }
}
