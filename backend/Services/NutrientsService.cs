using backend.Models;
using backend.Exceptions;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class NutrientsService
    {
        private readonly INutrientsRepository _nutrientsRepository;

        public NutrientsService(INutrientsRepository nutrientsRepository)
        {
            _nutrientsRepository = nutrientsRepository;
        }

        public async Task<Nutrients> GetNutrientsByFoodAsync(int foodId)
        {
            if (foodId <= 0)
                throw new ValidationException("Invalid foodId");

            var nutrients = await _nutrientsRepository.GetNutrientsByFoodIdAsync(foodId);
            if (nutrients == null)
                throw new NotFoundException($"Nutrients record for food with id {foodId} not found");

            return nutrients;
        }

        public async Task<Nutrients> CreateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates)
        {
            ValidateInput(foodId, protein, fat, carbohydrates);

            var created = await _nutrientsRepository.CreateNutrientsAsync(foodId, protein, fat, carbohydrates);
            if (created == null)
                throw new InvalidOperationException("Failed to create nutrients record");

            return created;
        }

        public async Task<Nutrients> UpdateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates)
        {
            ValidateInput(foodId, protein, fat, carbohydrates);

            var existing = await _nutrientsRepository.GetNutrientsByFoodIdAsync(foodId);
            if (existing == null)
                throw new NotFoundException($"Nutrients record for food with id {foodId} not found");

            var updated = await _nutrientsRepository.UpdateNutrientsAsync(foodId, protein, fat, carbohydrates);
            if (updated == null)
                throw new InvalidOperationException("Failed to update nutrients record");

            return updated;
        }

        public async Task<bool> DeleteNutrientsAsync(int foodId)
        {
            if (foodId <= 0)
                throw new ValidationException("Invalid foodId");

            var existing = await _nutrientsRepository.GetNutrientsByFoodIdAsync(foodId);
            if (existing == null)
                throw new NotFoundException($"Nutrients record for food with id {foodId} not found");

            return await _nutrientsRepository.DeleteNutrientsAsync(foodId);
        }

        private void ValidateInput(int foodId, decimal protein, decimal fat, decimal carbohydrates)
        {
            if (foodId <= 0)
                throw new ValidationException("Invalid foodId");

            if (protein < 0 || fat < 0 || carbohydrates < 0)
                throw new ValidationException("Nutrient values cannot be negative");

            if (protein == 0 && fat == 0 && carbohydrates == 0)
                throw new ValidationException("At least one nutrient value must be greater than zero");
        }
    }
}
