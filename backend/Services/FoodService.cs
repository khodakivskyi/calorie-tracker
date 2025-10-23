using backend.Models;
using backend.Exceptions;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class FoodService
    {
        private readonly IFoodRepository _foodRepository;

        public FoodService(IFoodRepository foodRepository)
        {
            _foodRepository = foodRepository;
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

        public async Task<Food> CreateFoodAsync(int? userId, string name, int? imageId, string? externalId = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException("Food name cannot be empty");

            var food = new Food(userId, name, imageId, externalId);
            var createdFood = await _foodRepository.CreateFoodAsync(food);
            
            if (createdFood == null)
                throw new InvalidOperationException("Failed to create food");

            return createdFood;
        }

        public async Task<Food> UpdateFoodAsync(int foodId, int userId, string? name = null, int? imageId = null, string? externalId = null)
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
