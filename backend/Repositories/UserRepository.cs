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

        public async Task<User?> CreateUserAsync(User user)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);

                const string query = @"
            INSERT INTO Users (Name, Email, PasswordHash, Salt, CreatedAt)
                VALUES (@Name, @Email, @PasswordHash, @Salt, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int);";

                var userId = await connection.QuerySingleAsync<int>(query, user);

                return await GetUserByIdAsync(userId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                return null;
            }
        }
        public async Task<User?> GetUserByIdAsync(int id)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);

                const string query = @"
            SELECT Id, Name, Email, PasswordHash, Salt, CreatedAt, IsActive 
            FROM Users 
            WHERE Id = @Id";

                var user = await connection.QuerySingleAsync<User>(query, new { Id = id });

                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> ValidateUserAsync(User user) { }
        public async Task<User> AuthenticateUserAsync(string email, string password) { }
    }
}
