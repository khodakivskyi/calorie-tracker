using System.Text;
using backend.Models;
using backend.Repositories;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Security.Cryptography;

namespace backend.Services
{
    public class UserService
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> ValidateUserAsync(User user)
        {
            if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.PasswordHash))
                return false;
            var existingUser = await _userRepository.GetUserByIdAsync(user.Id);
            return existingUser != null;
        }


        public async Task<User> AuthenticateUserAsync(string email, string password)
        {
            try
            {
                using var connection = new SqlConnection(_userRepository.ConnectionString);//////
                const string query = @"select Id, Name, Email, PasswordHash, Salt from Users where Email = @Email";
                var user = await connection.QuerySingleOrDefaultAsync<User>(query, new { Email = email });
                if (user == null)
                    return null;

                var hashedPassword = HashPassword(password, user.Salt);

                return hashedPassword == user.PasswordHash ? user : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error authenticating user: {ex.Message}");
                return null;
            }
        }
        public async Task<User?> CreateUserAsync(string email, string password, string? name = null)
        {
            try
            {
                string salt = GenerateSalt();
                string hashedPassword = HashPassword(password, salt);

                var newUser = new User(email, hashedPassword, salt, name);

                return await _userRepository.CreateUserAsync(newUser);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                return null;
            }
        }

        private string HashPassword(string password, string salt)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(password + salt);
                byte[] hashBytes = sha256.ComputeHash(inputBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }

        private string GenerateSalt()
        {
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            var saltBytes = new byte[32];
            rng.GetBytes(saltBytes);
            return Convert.ToBase64String(saltBytes);
        }


    }
}
