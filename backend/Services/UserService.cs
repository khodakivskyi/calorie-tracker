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
            var existingUser = await _userRepository.GetUserByEmailAsync(user.Email);
            if (existingUser != null && existingUser.Id != user.Id)
            {
                throw new ArgumentException($"User with email '{user.Email}' already exists");
            }

            if (!string.IsNullOrEmpty(newPassword))
            {
                string newSalt = GenerateSalt();
                string newPasswordHash = HashPassword(newPassword, newSalt);

                user.Salt = newSalt;
                user.PasswordHash = newPasswordHash;
            }

            return await _userRepository.UpdateUserAsync(user);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _userRepository.DeleteUserAsync(id);
        }

        public async Task<User?> CreateUserAsync(string email, string password, string? name)
        {
            var existingUser = await _userRepository.GetUserByEmailAsync(email);
            if (existingUser != null)
            {
                throw new ArgumentException($"User with email '{email}' already exists");
            }

            string salt = GenerateSalt();
            string passwordHash = HashPassword(password, salt);

            var newUser = new User(email, passwordHash, salt, name);

            return await _userRepository.CreateUserAsync(newUser);
        }

        public async Task<User?> AuthenticateUserAsync(string email, string password)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null) return null;

            var hashedPassword = HashPassword(password, user.Salt);

            if (hashedPassword == user.PasswordHash)
                return user;

            return null;
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
