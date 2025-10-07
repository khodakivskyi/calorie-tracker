using System.Text;
using backend.Models;
//using backend.Exceptions;
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
            //if (meal == null)
            //    throw new NotFoundException($"Meal with id {id} not found");
            
            return meal;
        }

        public async Task<IEnumerable<Meal>> GetAllMealsByUserAsync(int ownerId)
        {
            var meals = await _mealRepository.GetAllMealsByUserAsync(ownerId);
            //if (!meals.Any())
            //    throw new NotFoundException($"Meals for ownerId '{ownerId}' not found");
           
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
    }
}