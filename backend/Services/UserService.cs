using System.Text;
using backend.Models;
using backend.Exceptions;
using System.Security.Cryptography;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            return user;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            return user;
        }

        public async Task<User> UpdateUserAsync(int id, string? email, string? password, string? name)
        {
            var user = await this.GetUserByIdAsync(id);

            if (!string.IsNullOrEmpty(email) && email != user.Email)
            {
                if (!email.Contains("@"))
                    throw new ValidationException("Invalid email format");

                var userWithSameEmail = await _userRepository.GetUserByEmailAsync(email);
                if (userWithSameEmail != null)
                    throw new ConflictException("Email conflict");

                user.Email = email;
            }

            if (!string.IsNullOrEmpty(password))
            {
                if (password.Length < 6)
                    throw new ValidationException("Password must be at least 6 characters");

                string newPasswordHash = HashPassword(password, user.Salt);

                if (user.PasswordHash != newPasswordHash)
                {
                    string newSalt = GenerateSalt();
                    newPasswordHash = HashPassword(password, newSalt);

                    user.Salt = newSalt;
                    user.PasswordHash = newPasswordHash;
                }
            }

            if (!string.IsNullOrEmpty(name) && user.Name != name)
                user.Name = name;

            var updatedUser = await _userRepository.UpdateUserAsync(user);
            if (updatedUser == null)
                throw new NotFoundException("Failed to update user");

            return updatedUser;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            await this.GetUserByIdAsync(id);

            return await _userRepository.DeleteUserAsync(id);
        }

        public async Task<User> CreateUserAsync(string email, string password, string? name)
        {
            if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
                throw new ValidationException("Invalid email format");

            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
                throw new ValidationException("Password must be at least 6 characters");

            var existingUser = await _userRepository.GetUserByEmailAsync(email);
            if (existingUser != null)
                throw new ConflictException("Email conflict");

            string salt = GenerateSalt();
            string passwordHash = HashPassword(password, salt);

            var newUser = new User(email, passwordHash, salt, name);

            var createdUser = await _userRepository.CreateUserAsync(newUser);
            if (createdUser == null)
                throw new InvalidOperationException("User creation failed");

            return createdUser;
        }

        public async Task<User> AuthenticateUserAsync(string email, string password)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);

            if (user == null)
                throw new ValidationException("Invalid email or password");

            var hashedPassword = HashPassword(password, user.Salt);

            if (hashedPassword != user.PasswordHash)
                throw new ValidationException("Invalid email or password");

            return user;
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
