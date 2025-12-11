using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ICalorieLimitRepository
    {
        Task<CalorieLimit?> GetLimitByOwnerIdAsync(int ownerId);
        Task<CalorieLimit?> CreateLimitAsync(CalorieLimit limit);
        Task<CalorieLimit?> UpdateLimitAsync(CalorieLimit limit);
        Task<bool> DeleteLimitAsync(int ownerId);
    }

}
