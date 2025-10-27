﻿using backend.Models;
using backend.Exceptions;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class FoodService
    {
        private readonly IFoodRepository _foodRepository;
        private readonly CaloriesService _caloriesService;
        private readonly NutrientsService _nutrientsService;

        public FoodService(IFoodRepository foodRepository, CaloriesService caloriesService, NutrientsService nutrientsService)
        {
            _foodRepository = foodRepository;
            _caloriesService = caloriesService;
            _nutrientsService = nutrientsService;
        }

        public async Task<Food> GetFoodByIdAsync(int foodId, int userId)
        {
            var food = await _foodRepository.GetFoodByIdAsync(foodId, userId);
            if (food == null)
                throw new NotFoundException($"Food with id {foodId} not found");

            return food;
        }

        public async Task<IEnumerable<Food>> GetFoodsByUserAsync(int userId)
        {
            return await _foodRepository.GetFoodsByUserAsync(userId);
        }

        public async Task<IEnumerable<Food>> GetPrivateFoodsByUserAsync(int userId)
        {
            return await _foodRepository.GetPrivateFoodsByUserAsync(userId);
        }

        public async Task<IEnumerable<Food>> GetGlobalFoodsAsync()
        {
            return await _foodRepository.GetGlobalFoodsAsync();
        }

        public async Task<Food?> GetFoodByExternalIdAsync(string externalId)
        {
            return await _foodRepository.GetFoodByExternalIdAsync(externalId);
        }

        public async Task<Food> CreateFoodAsync(int? userId, string name, int? imageId, string? externalId = null, decimal? calories = null, decimal? protein = null, decimal? fat = null, decimal? carbohydrates = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException("Food name cannot be empty");

            var food = new Food(userId, name, imageId, externalId);
            var createdFood = await _foodRepository.CreateFoodAsync(food);
            
            if (createdFood == null)
                throw new InvalidOperationException("Failed to create food");

            if (calories.HasValue && calories.Value > 0)
            {
                await _caloriesService.CreateCaloriesAsync(createdFood.Id, calories.Value);
            }

            if (protein.HasValue && fat.HasValue && carbohydrates.HasValue)
            {
                var proteinValue = protein.Value;
                var fatValue = fat.Value;
                var carbohydratesValue = carbohydrates.Value;

                await _nutrientsService.CreateNutrientsAsync(
                    createdFood.Id,
                    proteinValue,
                    fatValue,
                    carbohydratesValue
                );

                if (!calories.HasValue || calories.Value == 0)
                {
                    var calculatedCalories = (proteinValue * 4) + (fatValue * 9) + (carbohydratesValue * 4);
                    if (calculatedCalories > 0)
                    {
                        await _caloriesService.CreateCaloriesAsync(createdFood.Id, calculatedCalories);
                    }
                }
            }

            return createdFood;
        }

        public async Task<Food> UpdateFoodAsync(int foodId, int userId, string? name = null, int? imageId = null, string? externalId = null, decimal? calories = null, decimal? protein = null, decimal? fat = null, decimal? carbohydrates = null)
        {
            var existingFood = await this.GetFoodByIdAsync(foodId, userId);

            if (existingFood.OwnerId == null)
                throw new ValidationException("You cannot update global foods");

            if (existingFood.OwnerId != userId)
                throw new ValidationException("You can only update your own foods");

            if (!string.IsNullOrWhiteSpace(name) && name != existingFood.Name)
                existingFood.Name = name;

            if (imageId.HasValue && imageId != existingFood.ImageId)
                existingFood.ImageId = imageId;

            if (!string.IsNullOrWhiteSpace(externalId) && externalId != existingFood.ExternalId)
                existingFood.ExternalId = externalId;

            var updatedFood = await _foodRepository.UpdateFoodAsync(existingFood);
            if (updatedFood == null)
                throw new NotFoundException("Failed to update food");

            if (calories.HasValue)
            {
                var existingCalories = await _caloriesService.GetCaloriesByFoodAsync(foodId);
                if (existingCalories != null)
                {
                    await _caloriesService.UpdateCaloriesAsync(foodId, calories.Value);
                }
                else
                {
                    await _caloriesService.CreateCaloriesAsync(foodId, calories.Value);
                }
            }

            if (protein.HasValue && fat.HasValue && carbohydrates.HasValue)
            {
                var proteinValue = protein.Value;
                var fatValue = fat.Value;
                var carbohydratesValue = carbohydrates.Value;

                try
                {
                    var existingNutrients = await _nutrientsService.GetNutrientsByFoodAsync(foodId);
                    if (existingNutrients != null)
                    {
                        await _nutrientsService.UpdateNutrientsAsync(foodId, proteinValue, fatValue, carbohydratesValue);
                    }
                }
                catch (NotFoundException)
                {
                    await _nutrientsService.CreateNutrientsAsync(foodId, proteinValue, fatValue, carbohydratesValue);
                }

                if (!calories.HasValue)
                {
                    var calculatedCalories = (proteinValue * 4) + (fatValue * 9) + (carbohydratesValue * 4);
                    try
                    {
                        await _caloriesService.UpdateCaloriesAsync(foodId, calculatedCalories);
                    }
                    catch (NotFoundException)
                    {
                        await _caloriesService.CreateCaloriesAsync(foodId, calculatedCalories);
                    }
                }
            }

            return updatedFood;
        }

        public async Task<bool> DeleteFoodAsync(int foodId, int userId)
        {
            var food = await this.GetFoodByIdAsync(foodId, userId);
            
            if (food.OwnerId == null)
                throw new ValidationException("You cannot delete global foods");

            if (food.OwnerId != userId)
                throw new ValidationException("You can only delete your own foods");

            return await _foodRepository.DeleteFoodAsync(foodId, userId);
        }

        public async Task<bool> DeleteAllFoodsByUserAsync(int userId)
        {
            return await _foodRepository.DeleteAllFoodsByUserAsync(userId);
        }
    }
}
