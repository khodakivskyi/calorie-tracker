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

        public async Task<User?> GetUserByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "SELECT id, name, email, password_hash AS PasswordHash, salt, " +
                              "email_confirmed AS EmailConfirmed, email_verification_token AS EmailVerificationToken, " +
                              "email_verification_expires AS EmailVerificationExpires " +
                              "FROM users WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "SELECT id, name, email, password_hash AS PasswordHash, salt, " +
                              "email_confirmed AS EmailConfirmed, email_verification_token AS EmailVerificationToken, " +
                              "email_verification_expires AS EmailVerificationExpires " +
                              "FROM users WHERE email = @Email";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
        }

        public async Task<User?> CreateUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
             INSERT INTO users (name, email, password_hash, salt, email_confirmed, email_verification_token, email_verification_expires) 
             VALUES (@Name, @Email, @PasswordHash, @Salt, @EmailConfirmed, @EmailVerificationToken, @EmailVerificationExpires);
             SELECT CAST(SCOPE_IDENTITY() as int);";

            var userId = await connection.QuerySingleAsync<int>(sql, user);

            return await GetUserByIdAsync(userId);
        }
        public async Task<User?> UpdateUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                UPDATE users
                SET name = @Name, email = @Email, password_hash = @PasswordHash, salt = @Salt,
                    email_confirmed = @EmailConfirmed, email_verification_token = @EmailVerificationToken,
                    email_verification_expires = @EmailVerificationExpires
                WHERE id = @Id";

            var affectedRows = await connection.ExecuteAsync(sql, user);

            if (affectedRows > 0)
                return await GetUserByIdAsync(user.Id);
            else return null;
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
