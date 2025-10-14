using backend.Models;
using backend.Exceptions;
using backend.Repositories.Interfaces;
using backend.Repositories;

namespace backend.Services
{
    public class FoodService
    {
        private readonly IFoodRepository _foodRepository;

        public FoodService(IFoodRepository foodRepository)
        {
            _foodRepository = foodRepository;
        }

        public async Task<Food> GetFoodByIdAsync(int id, int ownerId)
        {
            var food = await _foodRepository.GetFoodByIdAsync(id, ownerId);
            if (food == null)
                throw new NotFoundException($"Food with id {id} not found");

            return food;
        }

        public async Task<IEnumerable<Food>> GetFoodsByOwnerAsync(int ownerId)
        {
            return await _foodRepository.GetFoodsByOwnerAsync(ownerId);
        }
        public async Task<decimal?> GetFoodCaloriesAsync(int foodId)
        {
            var calories = await _foodRepository.GetFoodCaloriesAsync(foodId);

            if (calories == null)
                throw new NotFoundException($"Calories for food with id {foodId} not found");

        public async Task<Food> CreateFoodAsync(int ownerId, string name, int? imageId, int source, string? externalId = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException("Food name cannot be empty");

            if (source <= 0)
                throw new ValidationException("Invalid source");

            var food = new Food(ownerId, name, imageId, source, externalId);
            var createdFood = await _foodRepository.CreateFoodAsync(food);
            
            if (createdFood == null)
                throw new InvalidOperationException("Failed to create food");

            return createdFood;
        }

        public async Task<Food> UpdateFoodAsync(int id, int ownerId, string? name = null, int? imageId = null, int? source = null, string? externalId = null)
        {
            var existingFood = await this.GetFoodByIdAsync(id, ownerId);

            if (!string.IsNullOrWhiteSpace(name) && name != existingFood.Name)
                existingFood.Name = name;

            if (imageId.HasValue && imageId != existingFood.ImageId)
                existingFood.ImageId = imageId;

            if (source.HasValue && source.Value > 0 && source.Value != existingFood.Source)
                existingFood.Source = source.Value;

            if (!string.IsNullOrWhiteSpace(externalId) && externalId != existingFood.ExternalId)
                existingFood.ExternalId = externalId;

            var updatedFood = await _foodRepository.UpdateFoodAsync(existingFood);
            if (updatedFood == null)
                throw new NotFoundException("Failed to update food");

            return updatedFood;
        }

        public async Task<bool> DeleteFoodAsync(int id, int ownerId)
        {
            await this.GetFoodByIdAsync(id, ownerId);
            return await _foodRepository.DeleteFoodAsync(id, ownerId);
        }

        public async Task<bool> DeleteAllFoodsByUserAsync(int ownerId)
        {
            return await _foodRepository.DeleteAllFoodsByUserAsync(ownerId);
        }
    }
}
