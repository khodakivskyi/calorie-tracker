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
            const string sql = "SELECT id, name, email, password_hash, salt FROM users WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "SELECT id, name, email, password_hash, salt FROM users WHERE email = @Email";
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
    }
}
