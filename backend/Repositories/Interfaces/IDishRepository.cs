using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IDishRepository
    {
        Task<Dish?> GetDishByIdAsync(int id);
        Task<IEnumerable<Dish>> GetAllDishesByUserAsync(int ownerId);
        Task<Dish?> CreateDishAsync(Dish dish);
        Task<Dish?> UpdateDishAsync(Dish dish);
        Task<bool> DeleteDishAsync(int id);
        Task<bool> DeleteAllDishesByUserAsync(int ownerId);
        Task<bool> AddFoodAsync(int dishId, int foodId, decimal quantity);//rename 
        Task<bool> UpdateFoodQuantityAsync(int dishId, int foodId, decimal quantity);
        Task<bool> RemoveFoodAsync(int dishId, int foodId);
        Task<IEnumerable<(Food food, decimal quantity)>> GetAllFoodsByDishAsync(int dishId);
        Task<decimal> GetDishCaloriesAsync(int dishId);
        Task<bool> UpdateImageAsync(int dishId, int? imageId);
        Task<bool> RemoveImageAsync(int dishId);
    }
}
