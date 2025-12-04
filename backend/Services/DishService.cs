using backend.Exceptions;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class DishService
    {
        private readonly IDishRepository _dishRepository;
        private readonly CaloriesService _caloriesService;
        private readonly NutrientsService _nutrientsService;

        public DishService(IDishRepository dishRepository, CaloriesService caloriesService, NutrientsService nutrientsService)
        {
            _dishRepository = dishRepository;
            _caloriesService = caloriesService;
            _nutrientsService = nutrientsService;
        }

        public async Task<Dish> GetDishByIdAsync(int dishId, int userId)
        {
            var dish = await _dishRepository.GetDishByIdAsync(dishId, userId);
            if (dish == null)
                throw new NotFoundException($"Dish with id {dishId} not found");

            return dish;
        }

        public async Task<IEnumerable<Dish>> GetDishesByUserAsync(int userId)
        {
            var dishes = await _dishRepository.GetDishesByUserAsync(userId);

            var tasks = dishes.Select(async dish =>
            {
                var calories = await _caloriesService.GetOrCalculateCaloriesForDishAsync(dish.Id);
                var nutrients = await _nutrientsService.GetNutrientsByDishAsync(dish.Id);
                dish.Calories = calories;
                if (nutrients != null)
                {
                    dish.Proteins = nutrients.Protein;
                    dish.Carbohydrate = nutrients.Carbohydrate;
                    dish.Fats = nutrients.Fat;
                }
                return dish;
            });

            return await Task.WhenAll(tasks);
        }

        public async Task<IEnumerable<Dish>> GetPrivateDishesByUserAsync(int userId)
        {
            return await _dishRepository.GetPrivateDishesByUserAsync(userId);
        }

        public async Task<IEnumerable<Dish>> GetGlobalDishesAsync()
        {
            return await _dishRepository.GetGlobalDishesAsync();
        }

        public async Task<Dish> CreateDishAsync(int? userId, string name, decimal weight, int? imageId = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ValidationException("Dish name cannot be empty");

            if (weight <= 0)
                throw new ValidationException("Dish weight must be greater than 0");

            var dish = new Dish(userId, name, weight, imageId, false);
            var createdDish = await _dishRepository.CreateDishAsync(dish);

            if (createdDish == null)
                throw new InvalidOperationException("Failed to create dish");

            return createdDish;
        }

        public async Task<Dish> UpdateDishAsync(int userId, int dishId, string? name = null, decimal? weight = null, int? imageId = null)
        {
            var existingDish = await this.GetDishByIdAsync(dishId, userId);

            if (existingDish.OwnerId == null && existingDish.IsExternal)
                throw new ValidationException("You cannot update global dishes");

            if (existingDish.OwnerId != userId)
                throw new ValidationException("You can only update your own dishes");

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

        public async Task<bool> DeleteDishAsync(int dishId, int userId)
        {
            var dish = await this.GetDishByIdAsync(dishId, userId);

            if (dish.OwnerId == null)
                throw new ValidationException("You cannot delete global dishes");

            if (dish.OwnerId != userId)
                throw new ValidationException("You can only delete your own dishes");

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

            var dish = await this.GetDishByIdAsync(dishId, userId);

            if (dish.OwnerId == null)
                throw new ValidationException("You cannot modify global dishes");

            if (dish.OwnerId != userId)
                throw new ValidationException("You can only modify your own dishes");

            var success = await _dishRepository.AddFoodAsync(dishId, foodId, quantity);
            if (!success)
                throw new InvalidOperationException("Failed to add food to dish");

            return true;
        }

        public async Task<bool> UpdateFoodQuantityInDishAsync(int userId, int dishId, int foodId, decimal quantity)
        {
            if (quantity <= 0)
                throw new ValidationException("Quantity must be greater than 0");

            var dish = await this.GetDishByIdAsync(dishId, userId);

            if (dish.OwnerId == null)
                throw new ValidationException("You cannot modify global dishes");

            if (dish.OwnerId != userId)
                throw new ValidationException("You can only modify your own dishes");

            var success = await _dishRepository.UpdateFoodQuantityAsync(dishId, foodId, quantity);
            if (!success)
                throw new NotFoundException("Food not found in dish or failed to update quantity");

            return true;
        }

        public async Task<bool> RemoveFoodFromDishAsync(int userId, int dishId, int foodId)
        {
            var dish = await this.GetDishByIdAsync(dishId, userId);

            if (dish.OwnerId == null)
                throw new ValidationException("You cannot modify global dishes");

            if (dish.OwnerId != userId)
                throw new ValidationException("You can only modify your own dishes");

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
    }
}
