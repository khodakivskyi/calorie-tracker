using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IFoodRepository
    {
        Task<Food?> GetFoodByIdAsync(int id, int ownerId);
        Task<IEnumerable<Food>> GetFoodsByOwnerAsync(int ownerId);
        Task<Food?> CreateFoodAsync(Food food);
        Task<Food?> UpdateFoodAsync(Food food);
        Task<bool> DeleteFoodAsync(int id, int ownerId);
        Task<bool> DeleteAllFoodsByUserAsync(int ownerId);

        // === Calories methods === 
        Task<CaloriesModel?> GetCaloriesByFoodIdAsync(int foodId);
        Task<CaloriesModel?> CreateCaloriesAsync(int foodId, decimal calories);
        Task<CaloriesModel?> UpdateCaloriesAsync(int foodId, decimal calories);
        Task<bool> DeleteCaloriesAsync(int foodId);

        // === Nutrients methods ===
        Task<Nutrients?> GetNutrientsByFoodIdAsync(int foodId);
        Task<Nutrients?> CreateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates);
        Task<Nutrients?> UpdateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates);
        Task<bool> DeleteNutrientsAsync(int foodId);

        // === Aggregated method ===
        Task<(Food food, CaloriesModel? calories, Nutrients? nutrients)?> GetFoodWithDetailsAsync(int id, int ownerId);
    }
}