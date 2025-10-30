﻿using System.Text;
using backend.Models;
using backend.Exceptions;
using System.Security.Cryptography;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;


        public UserService(IUserRepository userRepository, IEmailSender emailSender, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _emailSender = emailSender;
            _configuration = configuration;
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

            string verificationToken = GenerateEmailToken();
            DateTime verificationExpires = DateTime.UtcNow.AddHours(12);

            var newUser = new User(email, passwordHash, salt, name, verificationToken, verificationExpires);

            var createdUser = await _userRepository.CreateUserAsync(newUser);
            if (createdUser == null)
                throw new InvalidOperationException("User creation failed");

            if(createdUser.EmailVerificationToken != null)
                await SendVerificationEmailAsync(createdUser.Email, createdUser.Id, createdUser.EmailVerificationToken);
            return createdUser;
        }

        public async Task<User> AuthenticateUserAsync(string email, string password)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);

            if (user == null)
                throw new ValidationException("Invalid email or password");

            if(!user.EmailConfirmed)
                throw new ValidationException("Please verify your email before logging in");

            var hashedPassword = HashPassword(password, user.Salt);

            if (hashedPassword != user.PasswordHash)
                throw new ValidationException("Invalid email or password");

            return user;
        }

        public async Task<bool> VerifyEmailAsync(int userId, string token)
        {
            throw new NotImplementedException();
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

        private static string GenerateEmailToken()
        {
            var tokenBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(tokenBytes);
            return Convert.ToBase64String(tokenBytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "");
        }

        private async Task SendVerificationEmailAsync(string email, int userId, string token)
        {
            var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";
            var verificationLink = $"{frontendUrl}/verify-email?userId={userId}&token={Uri.EscapeDataString(token)}";

            var message = $@"
                <h2>Welcome to Calorie Tracker! 🎉</h2>
                <p>Please verify your email address by clicking the link below:</p>
                <p><a href='{verificationLink}' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Verify Email</a></p>
                <p>Or copy this link to your browser:</p>
                <p style='word-break: break-all; font-family: monospace;'>{verificationLink}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, please ignore this email.</p>
            ";

            await _emailSender.SendEmailAsync(email, "Verify your email", message);
        }
    }
}
