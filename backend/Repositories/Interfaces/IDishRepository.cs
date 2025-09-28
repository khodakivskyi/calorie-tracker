using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IDishRepository
    {
        Task<Dish?> GetDishByIdAsync(int id);
        Task<IEnumerable<Dish?>> GetAllDishesAsync(int ownerId);
        Task<Dish?> CreateDishAsync(Dish dish);
        Task<Dish?> UpdateDishAsync(Dish dish);
        Task<bool> DeleteDishAsync(int id);
    }
}
