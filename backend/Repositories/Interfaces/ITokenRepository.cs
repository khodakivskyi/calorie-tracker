using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ITokenRepository
    {
        Task<VerificationToken?> CreateTokenAsync(int userId, string token, string tokenType, DateTime expiresAt);
        Task<VerificationToken?> GetTokenAsync(string token);
        Task<bool> MarkAsUsedAsync(int tokenId);
        Task<bool> DeleteUserTokensAsync(int userId, string tokenType);
        Task<int> CleanupExpiredTokensAsync();
    }
}

