using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class CalorieLimitRepository : ICalorieLimitRepository
    {
        private readonly string _connectionString;

        public CalorieLimitRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<CalorieLimit?> GetLimitByUserIdAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);

            const string sql = @"
                SELECT 
                    id,
                    user_id AS UserId,
                    limit_value AS LimitValue,
                    created_at AS CreatedAt
                FROM calorie_limits
                WHERE user_id = @UserId;
            ";

            return await connection.QuerySingleOrDefaultAsync<CalorieLimit>(sql, new { UserId = userId });
        }

        public async Task<CalorieLimit?> CreateLimitAsync(CalorieLimit limit)
        {
            using var connection = new SqlConnection(_connectionString);

            const string sql = @"
                INSERT INTO calorie_limits (user_id, limit_value)
                OUTPUT INSERTED.id,
                       INSERTED.user_id AS UserId,
                       INSERTED.limit_value AS LimitValue,
                       INSERTED.created_at AS CreatedAt
                VALUES (@UserId, @LimitValue);
            ";

            return await connection.QuerySingleOrDefaultAsync<CalorieLimit>(sql, limit);
        }

        public async Task<CalorieLimit?> UpdateLimitAsync(CalorieLimit limit)
        {
            using var connection = new SqlConnection(_connectionString);

            const string sql = @"
                UPDATE calorie_limits
                SET limit_value = @LimitValue
                OUTPUT INSERTED.id,
                       INSERTED.user_id AS UserId,
                       INSERTED.limit_value AS LimitValue,
                       INSERTED.created_at AS CreatedAt
                WHERE user_id = @UserId;
            ";

            return await connection.QuerySingleOrDefaultAsync<CalorieLimit>(sql, limit);
        }

        public async Task<bool> DeleteLimitAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);

            const string sql = @"DELETE FROM calorie_limits WHERE user_id = @UserId";

            var affectedRows = await connection.ExecuteAsync(sql, new { UserId = userId });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteLimitByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);

            const string sql = @"DELETE FROM calorie_limits WHERE id = @Id";

            var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }
    }
}
