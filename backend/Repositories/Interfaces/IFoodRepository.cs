using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IFoodRepository
    {
        Task<Food?> GetFoodByIdAsync(int id, int ownerId);
        Task<IEnumerable<Food>> GetFoodsByOwnerAsync(int ownerId);
        Task<Food> CreateFoodAsync(Food food);
        Task<Food?> UpdateFoodAsync(Food food);
        Task<bool> DeleteFoodAsync(int id, int ownerId);
        Task<bool> DeleteAllFoodsByUserAsync(int ownerId);
    }
}
