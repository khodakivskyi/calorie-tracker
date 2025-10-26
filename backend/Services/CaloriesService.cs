using backend.Models;
using backend.Exceptions;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class CaloriesService
    {
        private readonly ICaloriesRepository _caloriesRepository;
        private readonly INutrientsRepository _nutrientsRepository;

        public CaloriesService(ICaloriesRepository caloriesRepository, INutrientsRepository nutrientsRepository)
        {
            _caloriesRepository = caloriesRepository;
            _nutrientsRepository = nutrientsRepository;
        }

        public async Task<CaloriesModel> GetCaloriesByFoodAsync(int foodId)
        {
            var calories = await _caloriesRepository.GetCaloriesByFoodAsync(foodId);
            if (calories == null)
                throw new NotFoundException($"Calories record for food with id {foodId} not found");
            return calories;
        }
        public async Task<CaloriesModel> CreateCaloriesAsync(int foodId, decimal calories)
        {
            if (foodId <= 0)
                throw new ValidationException("Invalid foodId");

            if (calories <= 0)
                throw new ValidationException("Calories must be greater than zero");

            var created = await _caloriesRepository.CreateCaloriesAsync(foodId, calories);

            if (created == null)
                throw new InvalidOperationException("Failed to create calories record");

            return created;
        }
        public async Task<CaloriesModel> UpdateCaloriesAsync(int foodId, decimal calories)
        {
            if (foodId <= 0)
                throw new ValidationException("Invalid foodId");

            if (calories <= 0)
                throw new ValidationException("Calories must be greater than zero");

            var existing = await _caloriesRepository.GetCaloriesByFoodAsync(foodId);
            if (existing == null)
                throw new NotFoundException($"Calories record for food with id {foodId} not found");

            var updated = await _caloriesRepository.UpdateCaloriesAsync(foodId, calories);
            if (updated == null)
                throw new InvalidOperationException("Failed to update calories record");

            return updated;
        }

        public async Task<bool> DeleteCaloriesAsync(int foodId)
        {
            var existing = await _caloriesRepository.GetCaloriesByFoodAsync(foodId);
            if (existing == null)
                throw new NotFoundException($"Calories record for food with id {foodId} not found");

            return await _caloriesRepository.DeleteCaloriesAsync(foodId);
        }

        public async Task<decimal> GetOrCalculateCaloriesForFoodAsync(int foodId)
        {
            var calories = await _caloriesRepository.GetCaloriesByFoodAsync(foodId);
            if (calories != null)
                return calories.Calories;

            var nutrients = await _nutrientsRepository.GetNutrientsByFoodAsync(foodId);
            if (nutrients != null)
                return CalculateCaloriesFromNutrients(nutrients);

            throw new NotFoundException($"No calories or nutrients data available for food {foodId}");
        }

        public async Task<decimal> GetOrCalculateCaloriesForDishAsync(int dishId)
        {
            var calories = await _caloriesRepository.GetCaloriesByDishAsync(dishId);
            if (calories != null)
                return calories.Calories;

            var nutrients = await _nutrientsRepository.GetNutrientsByDishAsync(dishId);
            if (nutrients != null)
                return CalculateCaloriesFromNutrients(nutrients);

            throw new NotFoundException($"No calories or nutrients data available for dish {dishId}");
        }

        public decimal CalculateCaloriesFromNutrients(Nutrients nutrients)
        {
            return (nutrients.Protein * 4) + (nutrients.Fat * 9) + (nutrients.Carbohydrates * 4);
        }

        public async Task<decimal> GetOrCalculateCaloriesForMealAsync(int mealId)
        {
            var calories = await _caloriesRepository.GetCaloriesByMealAsync(mealId);
            if (calories != null)
                return calories.Calories;

            var nutrients = await _nutrientsRepository.GetNutrientsByMealAsync(mealId);
            if (nutrients != null)
                return CalculateCaloriesFromNutrients(nutrients);

            throw new NotFoundException($"No calories or nutrients data available for meal {mealId}");
        }
    }
}
