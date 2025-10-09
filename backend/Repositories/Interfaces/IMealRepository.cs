﻿using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IMealRepository
    {
        Task<Meal?> GetMealByIdAsync(int id);
        Task<IEnumerable<Meal>> GetAllMealsByUserAsync(int ownerId);
        Task<Meal> CreateMealAsync(Meal meal);
        Task<Meal?> UpdateMealAsync(Meal meal);
        Task<bool> DeleteMealAsync(int id);
        Task<bool> DeleteAllMealsByUserAsync(int ownerId);

        //
        Task<bool> AddDishToMealAsync(int mealId, int dishId, decimal quantity);
        Task<bool> UpdateDishQuantityInMealAsync(int mealId, int dishId, decimal quantity);
        Task<bool> RemoveDishFromMealAsync(int mealId, int dishId);
        Task<IEnumerable<MealDish>> GetDishesByMealAsync(int mealId);

        //
        Task<decimal> GetMealTotalCaloriesAsync(int mealId);
        Task<Nutrients?> GetMealTotalNutrientsAsync(int mealId);

        //
        Task<IEnumerable<Meal>> GetMealsByDateRangeAsync(int ownerId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<Meal>> GetMealsByDateAsync(int ownerId, DateTime date);
        Task<IEnumerable<Meal>> GetMealsByNameAsync(int ownerId, string name);

        // 
        Task<decimal> GetDailyCaloriesAsync(int ownerId, DateTime date);
        Task<Dictionary<DateTime, decimal>> GetWeeklyCaloriesAsync(int ownerId, DateTime startDate);
        Task<Dictionary<DateTime, decimal>> GetMonthlyCaloriesAsync(int ownerId, int year, int month);
    }
}