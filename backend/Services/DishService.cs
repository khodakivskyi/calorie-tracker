using backend.Models;
using backend.Exceptions;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class DishService
    {
        private readonly IDishRepository _dishRepository;

        public DishService(IDishRepository dishRepository)
        {
            _dishRepository = dishRepository;
        }

        public async Task<Dish> GetDishByIdAsync(int id, int userId)
        {
            var dish = await _dishRepository.GetDishByIdAsync(id);
            if (dish == null)
                throw new NotFoundException($"Dish with id {id} not found");

            if (dish.OwnerId != userId)
                throw new ForbiddenException("You don't have access to this dish");

            return dish;
        }

        public async Task<IEnumerable<Dish>> GetAllDishesByUserAsync(int userId)
        {
            return await _dishRepository.GetAllDishesByUserAsync(userId);
        }

        public async Task<Dish> CreateDishAsync(int userId, string name, decimal weight, int? imageId = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException("Dish name cannot be empty");

            if (weight <= 0)
                throw new ValidationException("Dish weight must be greater than 0");

            var dish = new Dish(userId, name, weight, imageId);
            var createdDish = await _dishRepository.CreateDishAsync(dish);
            
            if (createdDish == null)
                throw new InvalidOperationException("Failed to create dish");

            return createdDish;
        }


//
        public async Task<Dish> UpdateDishAsync(int userId, int dishId, string? name = null, decimal? weight = null, int? imageId = null)
        {
            var existingDish = await this.GetDishByIdAsync(dishId, userId);

            if (!string.IsNullOrWhiteSpace(name) && name != existingDish.Name)
                existingDish.Name = name;

            if (weight.HasValue && weight.Value > 0 && weight.Value != existingDish.Weight)
                existingDish.Weight = weight.Value;

            if (imageId.HasValue && imageId != existingDish.ImageId)
                existingDish.ImageId = imageId;

            var updatedDish = await _dishRepository.UpdateDishAsync(existingDish);
            if (updatedDish == null)
                throw new NotFoundException("Failed to update dish");

            return updatedDish;
        }

        public async Task<bool> DeleteDishAsync(int userId, int dishId)
        {
            await this.GetDishByIdAsync(dishId, userId);
            return await _dishRepository.DeleteDishAsync(dishId);
        }

        public async Task<bool> DeleteAllDishesByUserAsync(int userId)
        {
            return await _dishRepository.DeleteAllDishesByUserAsync(userId);
        }

        public async Task<bool> AddFoodToDishAsync(int userId, int dishId, int foodId, decimal quantity)
        {
            if (quantity <= 0)
                throw new ValidationException("Quantity must be greater than 0");

            await this.GetDishByIdAsync(dishId, userId);

            var success = await _dishRepository.AddFoodAsync(dishId, foodId, quantity);
            if (!success)
                throw new InvalidOperationException("Failed to add food to dish");

            return true;
        }

        public async Task<bool> UpdateFoodQuantityInDishAsync(int userId, int dishId, int foodId, decimal quantity)
        {
            if (quantity <= 0)
                throw new ValidationException("Quantity must be greater than 0");

            await this.GetDishByIdAsync(dishId, userId);

            var success = await _dishRepository.UpdateFoodQuantityAsync(dishId, foodId, quantity);
            if (!success)
                throw new NotFoundException("Food not found in dish or failed to update quantity");

            return true;
        }

        public async Task<bool> RemoveFoodFromDishAsync(int userId, int dishId, int foodId)
        {
            await this.GetDishByIdAsync(dishId, userId);

            var success = await _dishRepository.RemoveFoodAsync(dishId, foodId);
            if (!success)
                throw new NotFoundException("Food not found in dish");

            return true;
        }

        public async Task<IEnumerable<(Food food, decimal quantity)>> GetAllFoodsByDishAsync(int userId, int dishId)
        {
            await this.GetDishByIdAsync(dishId, userId);
            return await _dishRepository.GetAllFoodsByDishAsync(dishId);
        }

        public async Task<decimal> GetDishCaloriesAsync(int userId, int dishId)
        {
            await this.GetDishByIdAsync(dishId, userId);
            return await _dishRepository.GetDishCaloriesAsync(dishId);
        }

//
        public async Task<bool> UpdateDishImageAsync(int userId, int dishId, int? imageId)
        {
            await this.GetDishByIdAsync(dishId, userId);

            var success = await _dishRepository.UpdateImageAsync(dishId, imageId);
            if (!success)
                throw new InvalidOperationException("Failed to update dish image");

            return true;
        }

        public async Task<bool> RemoveDishImageAsync(int userId, int dishId)
        {
            await this.GetDishByIdAsync(dishId, userId);

            var success = await _dishRepository.RemoveImageAsync(dishId);
            if (!success)
                throw new InvalidOperationException("Failed to remove dish image");

            return true;
        }
    }
}
