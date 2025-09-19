using System.Text;
using backend.Models;
using backend.Repositories;
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

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }

        public async Task<User?> UpdateUserAsync(User user, string? newPassword)
        {
            try
            {
                if (!string.IsNullOrEmpty(newPassword))
                {
                    string newSalt = GenerateSalt();
                    string newPasswordHash = HashPassword(newPassword, newSalt);

                    user.Salt = newSalt;
                    user.PasswordHash = newPasswordHash;
                }

                return await _userRepository.UpdateUserAsync(user);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error updating user: {ex.Message}");
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            try
            {
                return await _userRepository.DeleteUserAsync(id);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error deleting user: {ex.Message}");
            }
        }

        public async Task<User?> CreateUserAsync(string email, string password, string? name)
        {
            try
            {
                var existingUser = await _userRepository.GetUserByEmailAsync(email);
                if (existingUser != null) return null;

                string salt = GenerateSalt();
                string passwordHash = HashPassword(password, salt);

                var newUser = new User(email, passwordHash, salt, name);

                return await _userRepository.CreateUserAsync(newUser);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error creating user: {ex.Message}");
            }
        }

        public async Task<User?> AuthenticateUserAsync(string email, string password)
        {
            try
            {
                var user = await _userRepository.GetUserByEmailAsync(email);
                if (user == null) return null;

                var hashedPassword = HashPassword(password, user.Salt);

                if (hashedPassword == user.PasswordHash)
                    return user;

                return null;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error authentication user: {ex.Message}");
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
