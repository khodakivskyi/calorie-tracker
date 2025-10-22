using backend.Models;
using backend.Exceptions;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class MealService
    {
        private readonly IMealRepository _mealRepository;

        public MealService(IMealRepository mealRepository)
        {
            _mealRepository = mealRepository;
        }

        public async Task<Meal> GetMealByIdAsync(int id)
        {
            var meal = await _mealRepository.GetMealByIdAsync(id);
            if (meal == null)
                throw new NotFoundException($"Meal with id {id} not found");
            
            return meal;
        }

        public async Task<IEnumerable<Meal>> GetAllMealsByUserAsync(int userId)
        {
            return await _mealRepository.GetAllMealsByUserAsync(userId);
        }

        public async Task<Meal> CreateMealAsync(int userId, string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException("Meal name cannot be empty");

            var newMeal = new Meal(userId, name);
            var createdMeal = await _mealRepository.CreateMealAsync(newMeal);
            if (createdMeal == null)
                throw new InvalidOperationException("Failed to create meal");

            return createdMeal;
        }

        public async Task<Meal> UpdateMealAsync(int id, int userId, string name) 
        {
            var existingMeal = await this.GetMealByIdAsync(id);

            if (existingMeal.OwnerId != userId)
                throw new ValidationException("You can only update your own meals");

            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException("Meal name cannot be empty");

            existingMeal.Name = name;

            var updatedMeal = await _mealRepository.UpdateMealAsync(existingMeal);

            if (updatedMeal == null)
                throw new InvalidOperationException($"Failed to update meal with id '{id}'");

            return updatedMeal;
        }

        public async Task<bool> DeleteMealAsync(int id, int userId)
        {
            var meal = await this.GetMealByIdAsync(id);

            if (meal.OwnerId != userId)
                throw new ValidationException("You can only delete your own meals");

            return await _mealRepository.DeleteMealAsync(id);
        }

        public async Task<bool> DeleteAllMealsByUserAsync(int userId)
        {
            return await _mealRepository.DeleteAllMealsByUserAsync(userId);
        }

        public async Task<bool> AddDishToMealAsync(int userId, int mealId, int dishId, decimal quantity)
        {
            if (quantity <= 0)
                throw new ValidationException("Quantity must be greater than 0");

            var meal = await GetMealByIdAsync(mealId);
            
            if (meal.OwnerId != userId)
                throw new ValidationException("You can only modify your own meals");

            var success = await _mealRepository.AddDishToMealAsync(mealId, dishId, quantity);
            if (!success)
                throw new InvalidOperationException("Failed to add dish to meal");
            return success;
        }

        public async Task<bool> UpdateDishQuantityInMealAsync(int userId, int mealId, int dishId, decimal quantity)
        {
            if (quantity <= 0)
                throw new ValidationException("Quantity must be greater than 0");

            var meal = await GetMealByIdAsync(mealId);
            
            if (meal.OwnerId != userId)
                throw new ValidationException("You can only modify your own meals");

            var success = await _mealRepository.UpdateDishQuantityInMealAsync(mealId, dishId, quantity);
            if (!success)
                throw new InvalidOperationException("Failed to update dish quantity in meal");
            return success;
        }

        public async Task<bool> RemoveDishFromMealAsync(int userId, int mealId, int dishId)
        {
            var meal = await GetMealByIdAsync(mealId);
            
            if (meal.OwnerId != userId)
                throw new ValidationException("You can only modify your own meals");

            var success = await _mealRepository.RemoveDishFromMealAsync(mealId, dishId);
            if (!success)
                throw new InvalidOperationException("Failed to remove dish from meal");
            return success;
        }

        public async Task<IEnumerable<MealDishDto>> GetDishesByMealAsync(int mealId)
        {
            await GetMealByIdAsync(mealId);
            var dishes = await _mealRepository.GetDishesByMealAsync(mealId);
            return dishes;
        }

        public async Task<decimal> GetMealTotalCaloriesAsync(int mealId)
        {
            await GetMealByIdAsync(mealId);
            return await _mealRepository.GetMealTotalCaloriesAsync(mealId);
        }

        public async Task<Nutrients?> GetMealTotalNutrientsAsync(int mealId)
        {
            await GetMealByIdAsync(mealId);
            return await _mealRepository.GetMealTotalNutrientsAsync(mealId);
        }

        public async Task<IEnumerable<Meal>> GetMealsByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            return await _mealRepository.GetMealsByDateRangeAsync(userId, startDate, endDate);
        }

        public async Task<IEnumerable<Meal>> GetMealsByDateAsync(int userId, DateTime date)
        {
            return await _mealRepository.GetMealsByDateAsync(userId, date);
        }

        public async Task<IEnumerable<Meal>> GetMealsByNameAsync(int userId, string name)
        {
            return await _mealRepository.GetMealsByNameAsync(userId, name);
        }

        public async Task<decimal> GetDailyCaloriesAsync(int userId, DateTime date)
        {
            var totalCalories = await _mealRepository.GetDailyCaloriesAsync(userId, date);
            return totalCalories;
        }
        
        public async Task<Dictionary<DateTime, decimal>> GetWeeklyCaloriesAsync(int userId, DateTime startDate)
        {
            return await _mealRepository.GetWeeklyCaloriesAsync(userId, startDate);
        }

        public async Task<Dictionary<DateTime, decimal>> GetMonthlyCaloriesAsync(int userId, int year, int month)
        {
            return await _mealRepository.GetMonthlyCaloriesAsync(userId, year, month);
        }
    }
}