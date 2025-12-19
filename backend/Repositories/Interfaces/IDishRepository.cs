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

        // Only for private dishes
        Task<IEnumerable<Dish>> GetPrivateDishesByUserAsync(int userId);
        Task<Dish?> CreateDishAsync(Dish dish, IEnumerable<(int foodId, decimal weight)>? foods = null);
        Task<Dish?> UpdateDishAsync(Dish dish);
        Task<bool> DeleteDishAsync(int dishId);
        Task<bool> DeleteAllDishesByUserAsync(int userId);

        // Dish-Food relationship
        Task<bool> AddFoodAsync(int dishId, int foodId, decimal weight);
        Task<bool> UpdateFoodWeightAsync(int dishId, int foodId, decimal weight);
        Task<bool> RemoveFoodAsync(int dishId, int foodId);
        Task<IEnumerable<(Food food, decimal weight)>> GetAllFoodsByDishAsync(int dishId);
    }
}
