using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ITokenRepository
    {
        Task<VerificationToken?> CreateTokenAsync(int userId, string token, DateTime expiresAt);
        Task<VerificationToken?> GetTokenAsync(string token);
        Task<bool> DeleteTokenAsync(int tokenId);
        Task<bool> DeleteTokensByUserAsync(int userId);
    }
}

