using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, name, email, password_hash AS PasswordHash, salt, email_confirmed AS EmailConfirmed
                FROM users WHERE id = @UserId";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { UserId = userId });
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, name, email, password_hash AS PasswordHash, salt, email_confirmed AS EmailConfirmed
                FROM users WHERE email = @Email";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
        }

        public async Task<User?> GetUserWithRefreshTokenAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, name, email, password_hash AS PasswordHash, salt, email_confirmed AS EmailConfirmed,
                       refresh_token AS RefreshToken, refresh_token_expires AS RefreshTokenExpires
                FROM users WHERE id = @UserId";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { UserId = userId });
        }

        public async Task<User?> CreateUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
             INSERT INTO users (name, email, password_hash, salt, email_confirmed) 
             VALUES (@Name, @Email, @PasswordHash, @Salt, @EmailConfirmed);
             SELECT CAST(SCOPE_IDENTITY() as int);";

            var userId = await connection.QuerySingleAsync<int>(sql, user);

            return await GetUserByIdAsync(userId);
        }
        public async Task<User?> UpdateUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                UPDATE users
                SET name = @Name, 
                    email = @Email, 
                    password_hash = @PasswordHash, 
                    salt = @Salt,
                    email_confirmed = @EmailConfirmed,
                    refresh_token = @RefreshToken,
                    refresh_token_expires = @RefreshTokenExpires
                WHERE id = @Id";

            var affectedRows = await connection.ExecuteAsync(sql, user);

            if (affectedRows > 0)
                return await GetUserByIdAsync(user.Id);
            else return null;
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM users WHERE id = @UserId";
            var affectedRows = await connection.ExecuteAsync(sql, new { UserId = userId });
            return affectedRows > 0;
        }
    }
}
