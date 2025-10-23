using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IDishRepository
    {
        // Returns all types
        Task<Dish?> GetDishByIdAsync(int dishId, int userId);
        Task<IEnumerable<Dish>> GetDishesByUserAsync(int userId);

        // Only for global dishes
        Task<IEnumerable<Dish>> GetGlobalDishesAsync();
        Task<Dish?> GetDishByExternalIdAsync(string externalId);

        // Only for private dishes
        Task<IEnumerable<Dish>> GetPrivateDishesByUserAsync(int userId);
        Task<Dish?> CreateDishAsync(Dish dish);
        Task<Dish?> UpdateDishAsync(Dish dish);
        Task<bool> DeleteDishAsync(int id);
        Task<bool> DeleteAllDishesByUserAsync(int userId);
        
        // Dish-Food relationship
        Task<bool> AddFoodAsync(int dishId, int foodId, decimal quantity);
        Task<bool> UpdateFoodQuantityAsync(int dishId, int foodId, decimal quantity);
        Task<bool> RemoveFoodAsync(int dishId, int foodId);
        Task<IEnumerable<(Food food, decimal quantity)>> GetAllFoodsByDishAsync(int dishId);
    }
}
