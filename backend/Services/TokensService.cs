using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class TokenService
    {
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;

        public TokenService(JwtService jwtService, IUserRepository userRepository)
        {
            _jwtService = jwtService;
            _userRepository = userRepository;
        }

        // login
        public async Task<(string accessToken, string refreshToken)> GenerateTokensAsync(User user)
        {
            var accessToken = _jwtService.GenerateAccessToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpires = DateTime.UtcNow.AddDays(7);
            await _userRepository.UpdateUserAsync(user);

            return (accessToken, refreshToken);
        }

        // update access token from refresh token
        public async Task<(string? accessToken, string? refreshToken)> RefreshTokensAsync(
            string expiredAccessToken,
            string refreshToken)
        {
            var userId = _jwtService.GetUserIdFromExpiredToken(expiredAccessToken);
            if (userId == null)
                return (null, null);

            var user = await _userRepository.GetUserByIdAsync(userId.Value);
            if (user == null)
                return (null, null);

            if (user.RefreshToken != refreshToken)
                return (null, null);

            if (user.RefreshTokenExpires == null || user.RefreshTokenExpires < DateTime.UtcNow)
                return (null, null);

            return await GenerateTokensAsync(user);
        }

        // logout
        public async Task<bool> RevokeRefreshTokenAsync(int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
                return false;

            user.RefreshToken = null;
            user.RefreshTokenExpires = null;
            await _userRepository.UpdateUserAsync(user);

            return true;
        }
    }
}
