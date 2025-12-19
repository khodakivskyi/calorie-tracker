using backend.Exceptions;
using backend.Models;
using backend.Repositories;
using backend.Repositories.Interfaces;
using DotNetEnv;
using Microsoft.Data.SqlClient;

namespace backend.Services
{
    public class MealService
    {
        private readonly IMealRepository _mealRepository;
        private readonly IMealTypeRepository _mealTypeRepository;
        private readonly CaloriesService _caloriesService;
        private readonly NutrientsService _nutrientsService;

        public MealService(IMealRepository mealRepository, IMealTypeRepository mealTypeRepository, CaloriesService caloriesService, NutrientsService nutrientsService)
        {
            _mealRepository = mealRepository;
            _mealTypeRepository = mealTypeRepository;
            _caloriesService = caloriesService;
            _nutrientsService = nutrientsService;
        }

        public async Task<Meal> GetMealByIdAsync(int id)
        {
            var meal = await _mealRepository.GetMealByIdAsync(id);
            if (meal == null)
            {
                throw new NotFoundException($"Meal with id {id} not found");
            }

            var calories = await _caloriesService.GetOrCalculateCaloriesForMealAsync(meal.Id);
            var nutrients = await _nutrientsService.GetNutrientsByMealAsync(meal.Id);
            meal.Calories = calories;
            if (nutrients != null)
            {
                meal.Protein = nutrients.Protein;
                meal.Carbohydrate = nutrients.Carbohydrate;
                meal.Fat = nutrients.Fat;
            }

            return meal;
        }

        public async Task<IEnumerable<Meal>> GetMealsByUserAsync(int userId)
        {
            var meals = await _mealRepository.GetMealsByUserAsync(userId);

            var tasks = meals.Select(async meal =>
            {
                try
                {
                    var calories = await _caloriesService.GetOrCalculateCaloriesForMealAsync(meal.Id);
                    meal.Calories = calories;
                }
                catch (NotFoundException)
                {
                    meal.Calories = null;
                }

                var nutrients = await _nutrientsService.GetNutrientsByMealAsync(meal.Id);
                if (nutrients != null)
                {
                    meal.Protein = nutrients.Protein;
                    meal.Carbohydrate = nutrients.Carbohydrate;
                    meal.Fat = nutrients.Fat;
                }
                return meal;
            });

            return await Task.WhenAll(tasks);
        }


        public async Task<Meal> CreateMealAsync(
            int userId,
            int typeId,
            string? name,
            IEnumerable<(int dishId, decimal weight)> dishes)
        {
            var mealType = await _mealTypeRepository.GetMealTypeByIdAsync(typeId);
            if (mealType == null)
                throw new ValidationException("Invalid meal type");

            if (string.IsNullOrWhiteSpace(name) && typeId == 5)
                throw new ValidationException("Meal name cannot be empty");

            var dishesList = dishes.ToList();
            foreach (var (dishId, weight) in dishesList)
            {
                if (weight <= 0)
                    throw new ValidationException($"Weight must be greater than 0 for dish {dishId}");
            }

            var newMeal = new Meal
            {
                OwnerId = userId,
                TypeId = typeId,
                Name = typeId == 5 ? name! : mealType.Name,
            };

            var createdMeal = await _mealRepository.CreateMealAsync(newMeal, dishesList);
            if (createdMeal == null)
            {
                throw new InvalidOperationException("Failed to create meal");
            }
            return await GetMealByIdAsync(createdMeal.Id);
        }

        public async Task<Meal> UpdateMealAsync(int mealId, int userId, string name)
        {
            var existingMeal = await this.GetMealByIdAsync(mealId);

            if (existingMeal.OwnerId != userId)
                throw new ValidationException("You can only update your own meals");

            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException("Meal name cannot be empty");

            existingMeal.Name = name;

            var updatedMeal = await _mealRepository.UpdateMealAsync(existingMeal);

            if (updatedMeal == null)
                throw new InvalidOperationException($"Failed to update meal with id '{mealId}'");

            return updatedMeal;
        }

        public async Task<bool> DeleteMealAsync(int mealId, int userId)
        {
            var meal = await this.GetMealByIdAsync(mealId);

            if (meal.OwnerId != userId)
                throw new ValidationException("You can only delete your own meals");

            return await _mealRepository.DeleteMealAsync(mealId);
        }

        public async Task<bool> DeleteAllMealsByUserAsync(int userId)
        {
            return await _mealRepository.DeleteAllMealsByUserAsync(userId);
        }

        public async Task<bool> AddDishToMealAsync(int userId, int mealId, int dishId, decimal weight)
        {
            if (weight <= 0)
                throw new ValidationException("Weight must be greater than 0");

            var meal = await GetMealByIdAsync(mealId);

            if (meal.OwnerId != userId)
                throw new ValidationException("You can only modify your own meals");

            var success = await _mealRepository.AddDishToMealAsync(mealId, dishId, weight);
            if (!success)
                throw new InvalidOperationException("Failed to add dish to meal");
            return success;
        }

        public async Task<bool> UpdateDishWeightInMealAsync(int userId, int mealId, int dishId, decimal weight)
        {
            if (weight <= 0)
                throw new ValidationException("Weight must be greater than 0");

            var meal = await GetMealByIdAsync(mealId);

            if (meal.OwnerId != userId)
                throw new ValidationException("You can only modify your own meals");

            var success = await _mealRepository.UpdateDishWeightInMealAsync(mealId, dishId, weight);
            if (!success)
                throw new InvalidOperationException("Failed to update dish weight in meal");
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