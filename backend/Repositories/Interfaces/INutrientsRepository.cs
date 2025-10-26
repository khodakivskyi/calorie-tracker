using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface INutrientsRepository
    {
        Task<Nutrients?> CreateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates);
        Task<Nutrients?> UpdateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates);
        Task<bool> DeleteNutrientsAsync(int foodId);

        Task<Nutrients?> GetNutrientsByFoodAsync(int foodId);
        Task<Nutrients?> GetNutrientsByDishAsync(int dishId);
        Task<Nutrients?> GetNutrientsByMealAsync(int mealId);
    }
}
