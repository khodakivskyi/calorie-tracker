using backend.Models;


namespace backend.Repositories.Interfaces
{
    public interface ICaloriesRepository
    {
        Task<CaloriesModel?> CreateCaloriesAsync(int foodId, decimal calories);
        Task<CaloriesModel?> UpdateCaloriesAsync(int foodId, decimal calories);
        Task<bool> DeleteCaloriesAsync(int foodId);

        Task<CaloriesModel?> GetCaloriesByFoodIdAsync(int foodId);
        Task<CaloriesModel?> GetCaloriesByDishIdAsync(int dishId);
        Task<CaloriesModel?> GetCaloriesByMealIdAsync(int mealId);
    }
}
