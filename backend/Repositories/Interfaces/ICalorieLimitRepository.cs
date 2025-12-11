using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ICalorieLimitRepository
    {
        Task<CalorieLimit?> GetLimitByUserIdAsync(int userId);
        Task<CalorieLimit?> CreateLimitAsync(CalorieLimit limit);
        Task<CalorieLimit?> UpdateLimitAsync(CalorieLimit limit);
        Task<bool> DeleteLimitAsync(int userId);
    }

}
