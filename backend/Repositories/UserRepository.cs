using backend.Models;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class UserRepository
    {
        private readonly string _connectionString;

        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "SELECT id, name, email, password_hash AS PasswordHash, salt FROM users WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "SELECT id, name, email, password_hash AS PasswordHash, salt FROM users WHERE email = @Email";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
        }

        public async Task<User?> CreateUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
             INSERT INTO users (name, email, password_hash, salt) 
             VALUES (@Name, @Email, @PasswordHash, @Salt);
             SELECT CAST(SCOPE_IDENTITY() as int);";

            var userId = await connection.QuerySingleAsync<int>(sql, user);

            return await GetUserByIdAsync(userId);
        }
        public async Task<bool> UpdateUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                UPDATE users
                SET name = @Name, email = @Email, password_hash = @PasswordHash, salt = @Salt
                WHERE id = @Id";

            var affectedRows = await connection.ExecuteAsync(sql, user);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM users WHERE id = @Id";
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }
    }
}
