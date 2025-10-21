using backend.Models;


namespace backend.Repositories.Interfaces
{
    public interface ICaloriesRepository
    {
        // crud
        Task<CaloriesModel?> GetCaloriesByFoodIdAsync(int foodId);
        Task<CaloriesModel?> CreateCaloriesAsync(int foodId, decimal calories);
        Task<CaloriesModel?> UpdateCaloriesAsync(int foodId, decimal calories);
        Task<bool> DeleteCaloriesAsync(int foodId);
    }
}
