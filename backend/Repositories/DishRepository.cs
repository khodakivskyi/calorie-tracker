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
        public async Task<Dish?> GetDishByIdAsync(int dishId, int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, weight, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, is_external AS IsExternal 
                                 FROM dishes 
                                 WHERE id = @Id AND (owner_id = @UserId OR owner_id IS NULL)";
            return await connection.QueryFirstOrDefaultAsync<Dish>(sql, new { Id = dishId, UserId = userId });
        }

        public async Task<IEnumerable<Dish>> GetDishesByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, weight, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, is_external AS IsExternal 
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
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, is_external AS IsExternal 
                                 FROM dishes 
                                 WHERE owner_id IS NULL
                                 ORDER BY created_at DESC";
            return await connection.QueryAsync<Dish>(sql);
        }

        // Only for private dishes
        public async Task<IEnumerable<Dish>> GetPrivateDishesByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, weight, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, is_external AS IsExternal 
                                 FROM dishes 
                                 WHERE owner_id = @UserId
                                 ORDER BY created_at DESC";
            return await connection.QueryAsync<Dish>(sql, new { UserId = userId });
        }
        public async Task<Dish?> CreateDishAsync(Dish dish, IEnumerable<(int foodId, decimal weight)>? foodsList = null)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                const string dishSql = @"INSERT INTO dishes (owner_id, name, weight, image_id, is_external)
                                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, INSERTED.weight, 
                                       INSERTED.image_id AS ImageId, INSERTED.created_at AS CreatedAt, 
                                       INSERTED.updated_at AS UpdatedAt, INSERTED.is_external AS IsExternal
                                VALUES (@OwnerId, @Name, @Weight, @ImageId, @IsExternal);";

                var createdDish = await connection.QueryFirstOrDefaultAsync<Dish>(
                    dishSql,
                    dish,
                    transaction);

                if (createdDish == null)
                {
                    throw new InvalidOperationException("Failed to create dish");
                }

                if (foodsList != null && foodsList.Any())
                {
                    const string foodsSql = @"INSERT INTO dishes_foods (dish_id, food_id, weight)
                                     VALUES (@DishId, @FoodId, @Weight);";

                    var foodsParams = foodsList.Select(f => new
                    {
                        DishId = createdDish.Id,
                        FoodId = f.foodId,
                        Weight = f.weight
                    });

                    await connection.ExecuteAsync(foodsSql, foodsParams, transaction);
                }

                transaction.Commit();
                return createdDish;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
        public async Task<Dish?> UpdateDishAsync(Dish dish)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE dishes 
                                SET name = @Name, weight = @Weight, image_id = @ImageId, 
                                    is_external = @IsExternal, updated_at = GETDATE()
                                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, INSERTED.weight, 
                                       INSERTED.image_id AS ImageId, INSERTED.created_at AS CreatedAt, 
                                       INSERTED.updated_at AS UpdatedAt, INSERTED.is_external AS IsExternal
                                WHERE id = @Id AND owner_id = @OwnerId;";
            return await connection.QueryFirstOrDefaultAsync<Dish>(sql, dish);
        }
        public async Task<bool> DeleteDishAsync(int dishId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM dishes WHERE id = @Id";
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = dishId });
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
        public async Task<bool> AddFoodAsync(int dishId, int foodId, decimal weight)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO dishes_foods (dish_id, food_id, weight)
                                VALUES (@DishId, @FoodId, @Weight);";
            var affectedRows = await connection.ExecuteAsync(sql, new { DishId = dishId, FoodId = foodId, Weight = weight });
            return affectedRows > 0;
        }

        public async Task<bool> UpdateFoodWeightAsync(int dishId, int foodId, decimal weight)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE dishes_foods 
                                SET weight = @Weight
                                WHERE dish_id = @DishId AND food_id = @FoodId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { DishId = dishId, FoodId = foodId, Weight = weight });
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

        public async Task<IEnumerable<(Food food, decimal weight)>> GetAllFoodsByDishAsync(int dishId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT f.id, f.owner_id, f.name, f.image_id, f.created_at, f.updated_at, f.is_external, df.weight
                                FROM dishes_foods df
                                INNER JOIN foods f ON df.food_id = f.id
                                WHERE df.dish_id = @DishId;";

            var results = await connection.QueryAsync(sql, new { DishId = dishId });

            return results.Select(r => (
                food: new Food(
                    ownerId: r.owner_id,
                    name: r.name,
                    imageId: r.image_id,
                    isExternal: r.is_external
                )
                {
                    Id = r.id,
                    CreatedAt = r.created_at,
                    UpdatedAt = r.updated_at
                },
                weight: (decimal)r.weight
            ));
        }
    }
}
