using backend.Models;


namespace backend.Repositories.Interfaces
{
    public interface ICaloriesRepository
    {
        Task<CaloriesModel?> CreateCaloriesAsync(int foodId, decimal calories);
        Task<CaloriesModel?> UpdateCaloriesAsync(int foodId, decimal calories);
        Task<bool> DeleteCaloriesAsync(int foodId);

        Task<CaloriesModel?> GetCaloriesByFoodAsync(int foodId);
        Task<CaloriesModel?> GetCaloriesByDishAsync(int dishId);
        Task<CaloriesModel?> GetCaloriesByMealAsync(int mealId);
    }
}
