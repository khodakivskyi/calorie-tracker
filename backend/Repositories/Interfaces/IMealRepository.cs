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
    }
}
