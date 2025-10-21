using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IMealRepository
    {
        // crud
        Task<Meal?> GetMealByIdAsync(int id);
        Task<IEnumerable<Meal>> GetAllMealsByUserAsync(int userId);
        Task<Meal?> CreateMealAsync(Meal meal);
        Task<Meal?> UpdateMealAsync(Meal meal);
        Task<bool> DeleteMealAsync(int id);
        Task<bool> DeleteAllMealsByUserAsync(int userId);

        // Meal-Dish relationship
        Task<bool> AddDishToMealAsync(int mealId, int dishId, decimal quantity);
        Task<bool> UpdateDishQuantityInMealAsync(int mealId, int dishId, decimal quantity);
        Task<bool> RemoveDishFromMealAsync(int mealId, int dishId);
        Task<IEnumerable<MealDishDto>> GetDishesByMealAsync(int mealId);

        // Meal calculations
        Task<decimal> GetMealTotalCaloriesAsync(int mealId);
        Task<Nutrients?> GetMealTotalNutrientsAsync(int mealId);

        // Query by date/name
        Task<IEnumerable<Meal>> GetMealsByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<Meal>> GetMealsByDateAsync(int userId, DateTime date);
        Task<IEnumerable<Meal>> GetMealsByNameAsync(int userId, string name);

        // Analytics
        Task<decimal> GetDailyCaloriesAsync(int userId, DateTime date);
        Task<Dictionary<DateTime, decimal>> GetWeeklyCaloriesAsync(int userId, DateTime startDate);
        Task<Dictionary<DateTime, decimal>> GetMonthlyCaloriesAsync(int userId, int year, int month);
    }
}