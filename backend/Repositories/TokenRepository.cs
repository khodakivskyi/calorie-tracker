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

        public async Task<VerificationToken?> CreateTokenAsync(int userId, string token, DateTime expiresAt)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO verification_tokens (user_id, token, expires_at, created_at)
                OUTPUT INSERTED.id, INSERTED.user_id AS UserId, INSERTED.token AS Token,
                       INSERTED.expires_at AS ExpiresAt, INSERTED.created_at AS CreatedAt
                VALUES (@UserId, @Token, @ExpiresAt, GETUTCDATE())";

            return await connection.QuerySingleOrDefaultAsync<VerificationToken>(sql, new
            {
                UserId = userId,
                Token = token,
                ExpiresAt = expiresAt
            });
        }

        public async Task<VerificationToken?> GetTokenAsync(string token)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, user_id AS UserId, token, expires_at AS ExpiresAt, created_at AS CreatedAt
                FROM verification_tokens 
                WHERE token = @Token";

            return await connection.QueryFirstOrDefaultAsync<VerificationToken>(sql, new { Token = token });
        }

        public async Task<bool> DeleteTokenAsync(int tokenId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                DELETE FROM verification_tokens 
                WHERE id = @Id";

            var affectedRows = await connection.ExecuteAsync(sql, new { Id = tokenId });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteTokensByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                DELETE FROM verification_tokens 
                WHERE user_id = @UserId";

            var affectedRows = await connection.ExecuteAsync(sql, new { UserId = userId });
            return affectedRows > 0;
        }
    }
}
