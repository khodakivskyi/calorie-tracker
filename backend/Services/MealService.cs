using System.Text;
using backend.Models;
using backend.Exceptions;
using System.Security.Cryptography;
using backend.Repositories.Interfaces;
using backend.Repositories;
using System.ComponentModel.DataAnnotations;

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

        public async Task<IEnumerable<Meal>> GetAllMealsByUserAsync(int ownerId)
        {
            var meals = await _mealRepository.GetAllMealsByUserAsync(ownerId);
            if (!meals.Any())
                throw new NotFoundException($"Meals for ownerId '{ownerId}' not found");
           
            return meals;
        }

        public async Task<Meal> CreateMealAsync(int ownerId, string name)
        {
            var newMeal = new Meal(ownerId, name);
            var createdMeal = await _mealRepository.CreateMealAsync(newMeal);
            if (createdMeal == null)
                throw new InvalidOperationException("Failed to create meal");

            return createdMeal;
        }

        public async Task<Meal> UpdateMealAsync(int id, string name) 
        {
            var existingMeal = await this.GetMealByIdAsync(id);

            existingMeal.Name = name;

            var updatedMeal = await _mealRepository.UpdateMealAsync(existingMeal);

            if (updatedMeal == null)
                throw new InvalidOperationException($"Failed to update meal with id '{id}'");

            return updatedMeal;
        }

        public async Task<bool> DeleteMealAsync(int id)
        {
            await this.GetMealByIdAsync(id);

            return await _mealRepository.DeleteMealAsync(id);
        }

        public async Task<bool> DeleteAllMealsByUserAsync(int ownerId)
        {
            await this.GetAllMealsByUserAsync(ownerId);

            return await _mealRepository.DeleteAllMealsByUserAsync(ownerId);
        }

        public async Task<bool> AddDishToMealAsync(int mealId, int dishId, decimal quantity)
        {
            await GetMealByIdAsync(mealId);
            var success = await _mealRepository.AddDishToMealAsync(mealId, dishId, quantity);
            if (!success)
                throw new InvalidOperationException("Failed to add dish to meal");
            return success;
        }

        public async Task<bool> UpdateDishQuantityInMealAsync(int mealId, int dishId, decimal quantity)
        {
            await GetMealByIdAsync(mealId);
            var success = await _mealRepository.UpdateDishQuantityInMealAsync(mealId, dishId, quantity);
            if (!success)
                throw new InvalidOperationException("Failed to update dish quantity in meal");
            return success;
        }

        public async Task<bool> RemoveDishFromMealAsync(int mealId, int dishId)
        {
            await GetMealByIdAsync(mealId);
            var success = await _mealRepository.RemoveDishFromMealAsync(mealId, dishId);
            if (!success)
                throw new InvalidOperationException("Failed to remove dish from meal");
            return success;
        }

        public async Task<IEnumerable<MealDish>> GetDishesByMealAsync(int mealId)
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

        public async Task<IEnumerable<Meal>> GetMealsByDateRangeAsync(int ownerId, DateTime startDate, DateTime endDate)
        {
            var meals = await _mealRepository.GetMealsByDateRangeAsync(ownerId, startDate, endDate);
            if (!meals.Any())
                throw new NotFoundException($"No meals found between {startDate:d} and {endDate:d} for ownerId {ownerId}");
            return meals;
        }

        public async Task<IEnumerable<Meal>> GetMealsByDateAsync(int ownerId, DateTime date)
        {
            var meals = await _mealRepository.GetMealsByDateAsync(ownerId, date);
            if (!meals.Any())
                throw new NotFoundException($"No meals found on {date:d} for ownerId {ownerId}");
            return meals;
        }
        public async Task<IEnumerable<Meal>> GetMealsByNameAsync(int ownerId, string name)
        {
            var meals = await _mealRepository.GetMealsByNameAsync(ownerId, name);
            if (!meals.Any())
                throw new NotFoundException($"No meals found with name containing '{name}' for ownerId {ownerId}");
            return meals;
        }
    }
}