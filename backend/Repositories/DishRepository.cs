using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class DishRepository : IDishRepository
    {
        private readonly string _connectionString;
        public DishRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<Dish?> GetDishByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "SELECT id, owner_id, name, weight, image_id, created_at FROM dishes WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Dish>(sql, new { Id = id });
        }
        public async Task<IEnumerable<Dish?>> GetAllDishesByUserAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id, name, weight, image_id, created_at FROM dishes WHERE owner_id = @OwnerId
                                ORDER BY created_at DESC";
            return await connection.QueryAsync<Dish>(sql, new { OwnerId = ownerId });
        }
        public async Task<Dish?> CreateDishAsync(Dish dish)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO dishes (owner_id, name, weight, created_at, image_id)
                                OUTPUT INSERTED.id, INSERTED.owner_id, INSERTED.name, INSERTED.weight, INSERTED.image_id, INSERTED.created_at
                                VALUES (@OwnerId, @Name, @Weight, SYSUTCDATETIME(), @ImageId);";
            return await connection.QueryFirstOrDefaultAsync<Dish>(sql, dish);
        }
        public async Task<Dish?> UpdateDishAsync(Dish dish)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE dishes SET name = @Name, weight = @Weight, image_id = @ImageId
                                OUTPUT INSERTED.id, INSERTED.owner_id, INSERTED.name, INSERTED.weight, INSERTED.image_id, INSERTED.created_at
                                WHERE id = @Id AND owner_id = @OwnerId;";
            return await connection.QueryFirstOrDefaultAsync<Dish>(sql, dish);
        }
        public async Task<bool> DeleteDishAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM dishes WHERE id = @Id AND owner_id = @OwnerId";
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }
        public async Task<bool> DeleteAllDishesByUserAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM dishes_foods WHERE dish_id IN (SELECT id FROM dishes WHERE owner_id = @OwnerId);
                                DELETE FROM meals_dishes  WHERE dish_id IN (SELECT id FROM dishes WHERE owner_id = @OwnerId);
                                DELETE FROM dishes WHERE owner_id = @OwnerId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { OwnerId = ownerId });
            return affectedRows > 0;
        }

        //
        public async Task<bool> AddFoodAsync(int dishId, int foodId, decimal quantity)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO dishes_foods (dish_id, food_id, quantity)
                                VALUES (@DishId, @FoodId, @Quantity);";
            var affectedRows = await connection.ExecuteAsync(sql, new { DishId = dishId, FoodId = foodId, Quantity = quantity });
            return affectedRows > 0;
        }

        public async Task<bool> UpdateFoodQuantityAsync(int dishId, int foodId, decimal quantity)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE dishes_foods 
                                SET quantity = @Quantity
                                WHERE dish_id = @DishId AND food_id = @FoodId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { DishId = dishId, FoodId = foodId, Quantity = quantity });
            return affectedRows > 0;
        }

        public async Task<bool> RemoveFoodAsync(int dishId, int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM dishes_foods 
                                WHERE dish_id = @DishId AND food_id = @FoodId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { DishId = dishId, FoodId = foodId });
            return affectedRows > 0;
        }

        public async Task<IEnumerable<(Food food, decimal quantity)>> GetAllFoodsByDishAsync(int dishId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT f.id, f.owner_id, f.name, f.image_id, f.created_at, f.source, f.external_id, df.quantity
                                FROM dishes_foods df
                                INNER JOIN foods f ON df.food_id = f.id
                                WHERE df.dish_id = @DishId;";
            
            var results = await connection.QueryAsync(sql, new { DishId = dishId });
            
            return results.Select(r => (
                food: new Food(
                    ownerId: r.owner_id,
                    name: r.name,
                    imageId: r.image_id,
                    source: r.source,
                    externalId: r.external_id
                )
                {
                    Id = r.id,
                    CreatedAt = r.created_at
                },
                quantity: (decimal)r.quantity
            ));
        }

        public async Task<decimal> GetDishCaloriesAsync(int dishId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT ISNULL(SUM(c.calories * df.quantity), 0) as TotalCalories
                                FROM dishes_foods df
                                INNER JOIN foods f ON df.food_id = f.id
                                INNER JOIN calories c ON c.food_id = f.id
                                WHERE df.dish_id = @DishId;";
            
            var totalCalories = await connection.QueryFirstOrDefaultAsync<decimal>(sql, new { DishId = dishId });
            return totalCalories;
        }

        public async Task<bool> UpdateImageAsync(int dishId, int? imageId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE dishes 
                                SET image_id = @ImageId
                                WHERE id = @DishId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { DishId = dishId, ImageId = imageId });
            return affectedRows > 0;
        }

        public async Task<bool> RemoveImageAsync(int dishId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE dishes 
                                SET image_id = NULL
                                WHERE id = @DishId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { DishId = dishId });
            return affectedRows > 0;
        }
    }
}
