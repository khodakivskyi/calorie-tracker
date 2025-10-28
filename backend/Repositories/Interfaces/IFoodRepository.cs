using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IFoodRepository
    {
        // Returns all types
        Task<Food?> GetFoodByIdAsync(int foodId, int userId);
        Task<IEnumerable<Food>> GetFoodsByUserAsync(int userId);

        // Only for global foods
        Task<IEnumerable<Food>> GetGlobalFoodsAsync();
        Task<Food?> GetFoodByExternalIdAsync(string externalId);

        // Only for private foods
        Task<IEnumerable<Food>> GetPrivateFoodsByUserAsync(int userId);
        Task<Food?> CreateFoodAsync(Food food);
        Task<Food?> UpdateFoodAsync(Food food);
        Task<bool> DeleteFoodAsync(int foodId);
        Task<bool> DeleteAllFoodsByUserAsync(int userId);
    }
}