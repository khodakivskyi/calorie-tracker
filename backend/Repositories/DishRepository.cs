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

        // Returns all types
        public async Task<Dish?> GetDishByIdAsync(int id, int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, weight, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, external_id AS ExternalId 
                                 FROM dishes 
                                 WHERE id = @Id AND (owner_id = @UserId OR owner_id IS NULL)";
            return await connection.QueryFirstOrDefaultAsync<Dish>(sql, new { Id = id, UserId = userId });
        }
        
        public async Task<IEnumerable<Dish>> GetAllDishesByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, weight, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, external_id AS ExternalId 
                                 FROM dishes 
                                 WHERE owner_id = @UserId OR owner_id IS NULL
                                 ORDER BY 
                                    CASE WHEN owner_id = @UserId THEN 0 ELSE 1 END,
                                    created_at DESC";
            return await connection.QueryAsync<Dish>(sql, new { UserId = userId });
        }

        // Only for global dishes
        public async Task<IEnumerable<Dish>> GetGlobalDishesAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, weight, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, external_id AS ExternalId 
                                 FROM dishes 
                                 WHERE owner_id IS NULL
                                 ORDER BY created_at DESC";
            return await connection.QueryAsync<Dish>(sql);
        }

        public async Task<Dish?> GetDishByExternalIdAsync(string externalId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, weight, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, external_id AS ExternalId 
                                 FROM dishes 
                                 WHERE external_id = @ExternalId";
            return await connection.QuerySingleOrDefaultAsync<Dish>(sql, new { ExternalId = externalId });
        }

        // Only for private dishes
        public async Task<IEnumerable<Dish>> GetPrivateDishesByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, weight, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, external_id AS ExternalId 
                                 FROM dishes 
                                 WHERE owner_id = @UserId
                                 ORDER BY created_at DESC";
            return await connection.QueryAsync<Dish>(sql, new { UserId = userId });
        }
        public async Task<Dish?> CreateDishAsync(Dish dish)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO dishes (owner_id, name, weight, image_id, external_id)
                                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, INSERTED.weight, 
                                       INSERTED.image_id AS ImageId, INSERTED.created_at AS CreatedAt, 
                                       INSERTED.updated_at AS UpdatedAt, INSERTED.external_id AS ExternalId
                                VALUES (@OwnerId, @Name, @Weight, @ImageId, @ExternalId);";
            return await connection.QueryFirstOrDefaultAsync<Dish>(sql, dish);
        }
        public async Task<Dish?> UpdateDishAsync(Dish dish)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE dishes 
                                SET name = @Name, weight = @Weight, image_id = @ImageId, 
                                    external_id = @ExternalId, updated_at = GETDATE()
                                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, INSERTED.weight, 
                                       INSERTED.image_id AS ImageId, INSERTED.created_at AS CreatedAt, 
                                       INSERTED.updated_at AS UpdatedAt, INSERTED.external_id AS ExternalId
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
        public async Task<bool> DeleteAllDishesByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM dishes_foods WHERE dish_id IN (SELECT id FROM dishes WHERE owner_id = @UserId);
                                DELETE FROM meals_dishes  WHERE dish_id IN (SELECT id FROM dishes WHERE owner_id = @UserId);
                                DELETE FROM dishes WHERE owner_id = @UserId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { UserId = userId });
            return affectedRows > 0;
        }

        // Dish-Food relationship
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
            const string sql = @"SELECT f.id, f.owner_id, f.name, f.image_id, f.created_at, f.updated_at, f.external_id, df.quantity
                                FROM dishes_foods df
                                INNER JOIN foods f ON df.food_id = f.id
                                WHERE df.dish_id = @DishId;";
            
            var results = await connection.QueryAsync(sql, new { DishId = dishId });
            
            return results.Select(r => (
                food: new Food(
                    ownerId: r.owner_id,
                    name: r.name,
                    imageId: r.image_id,
                    externalId: r.external_id
                )
                {
                    Id = r.id,
                    CreatedAt = r.created_at,
                    UpdatedAt = r.updated_at
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
    }
}
