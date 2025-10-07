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

        public async Task<Food> CreateFoodAsync(Food food)
        {
           // var existingFood = await _foodRepository.GetFoodByNameAsync(food.Name);
           // if (existingFood != null)
              //  throw new ConflictException($"Food with name '{food.Name}' already exists"); //

            var createdFood = await _foodRepository.CreateFoodAsync(food);
            if (createdFood == null)
                throw new InvalidOperationException("Failed to create food");

            return createdFood;
        }

        public async Task<Food> UpdateFoodAsync(Food food)
        {
            var updatedFood = await _foodRepository.UpdateFoodAsync(food);
            if (updatedFood == null)
                throw new NotFoundException($"Failed to update food with id {food.Id}");
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
