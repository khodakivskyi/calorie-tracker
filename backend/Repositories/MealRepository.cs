using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class MealRepository : IMealRepository
    {
        private readonly string _connectionString;

        public MealRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<Meal?> GetMealByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "SELECT id, owner_id, name, created_at FROM meals WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Meal>(sql, new { Id = id});
        }

        public async Task<IEnumerable<Meal>> GetAllMealsByUserAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, created_at AS CreatedAt
                                 FROM meals
                                 WHERE owner_id = @OwnerId
                                 ORDER BY created_at DESC";
            return await connection.QueryAsync<Meal>(sql, new { OwnerId = ownerId });
        }

        public async Task<Meal> CreateMealAsync(Meal meal)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO meals (owner_id, name, created_at)
                                 OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, INSERTED.created_at AS CreatedAt
                                 VALUES (@OwnerId, @Name, SYSUTCDATETIME());";
            return await connection.QueryFirstOrDefaultAsync<Meal>(sql, meal);
        }

        public async Task<Meal?> UpdateMealAsync(Meal meal)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE meals
                                 SET name = @Name
                                 OUTPUT INSERTED.id, INSERTED.owner_id, INSERTED.name, INSERTED.created_at AS CreatedAt
                                 WHERE id = @Id;";
            return await connection.QueryFirstOrDefaultAsync<Meal>(sql, meal);
        }

        public async Task<bool> DeleteMealAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM meals_dishes WHERE meal_id = @Id;
                                 DELETE FROM meals WHERE id = @Id";
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = id});
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAllMealsByUserAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM meals_dishes WHERE meal_id IN (SELECT id FROM meals WHERE owner_id = @OwnerId);
                                 DELETE FROM meals WHERE owner_id = @OwnerId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { OwnerId = ownerId });
            return affectedRows > 0;
        }

        public async Task<bool> AddDishToMealAsync(int mealId, int dishId, decimal quantity)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO meals_dishes (meal_id, dish_id, quantity)
                                 VALUES (@MealId, @DishId, @Quantity);";
            var affectedRows = await connection.ExecuteAsync(sql, new { MealId = mealId, DishId = dishId, Quantity = quantity });
            return affectedRows > 0;
        }

        public async Task<bool> UpdateDishQuantityInMealAsync(int mealId, int dishId, decimal quantity)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE meals_dishes
                                 SET quantity = @Quantity
                                 WHERE meal_id = @MealId AND dish_id = @DishId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { MealId = mealId, DishId = dishId, Quantity = quantity });
            return affectedRows > 0;
        }

        public async Task<bool> RemoveDishFromMealAsync(int mealId, int dishId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM meals_dishes
                                 WHERE meal_id = @MealId AND dish_id = @DishId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { MealId = mealId, DishId = dishId });
            return affectedRows > 0;
        }

        public async Task<IEnumerable<MealDish>> GetDishesByMealAsync(int mealId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT meal_id AS MealId, dish_id AS DishId, quantity
                                 FROM meals_dishes
                                 WHERE meal_id = @MealId;";
            return await connection.QueryAsync<MealDish>(sql, new { MealId = mealId });
        }

        public async Task<decimal> GetMealTotalCaloriesAsync(int mealId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT ISNULL(SUM(c.calories * (df.quantity / 100.0) * (md.quantity / 100.0)), 0) AS TotalCalories
                FROM meals_dishes md
                INNER JOIN dishes_foods df ON md.dish_id = df.dish_id
                INNER JOIN foods f ON df.food_id = f.id
                INNER JOIN calories c ON c.food_id = f.id
                WHERE md.meal_id = @MealId;
            ";

            var totalCalories = await connection.QueryFirstOrDefaultAsync<decimal>(sql, new { MealId = mealId });
            return totalCalories;
        }


        public async Task<Nutrients?> GetMealTotalNutrientsAsync(int mealId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT 
                    SUM(n.Protein * (df.Quantity / 100.0) * (md.Quantity / 100.0)) AS Protein,
                    SUM(n.Fat * (df.Quantity / 100.0) * (md.Quantity / 100.0)) AS Fat,
                    SUM(n.Carbohydrates * (df.Quantity / 100.0) * (md.Quantity / 100.0)) AS Carbohydrates
                FROM meals_dishes md
                JOIN dishes_foods df ON md.dish_id = df.dish_id
                JOIN nutrients n ON df.food_id = n.food_id
                WHERE md.meal_id = @MealId;
            ";

            return await connection.QueryFirstOrDefaultAsync<Nutrients>(sql, new { MealId = mealId });
        }

        public async Task<IEnumerable<Meal>> GetMealsByDateRangeAsync(int ownerId, DateTime startDate, DateTime endDate)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, name, created_at AS CreatedAt
                FROM meals
                WHERE owner_id = @OwnerId
                  AND CAST(created_at AS date) BETWEEN @StartDate AND @EndDate
                ORDER BY created_at DESC;";

            return await connection.QueryAsync<Meal>(sql, new { OwnerId = ownerId, StartDate = startDate.Date, EndDate = endDate.Date });
        }

        public async Task<IEnumerable<Meal>> GetMealsByDateAsync(int ownerId, DateTime date)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, name, created_at AS CreatedAt
                FROM meals
                WHERE owner_id = @OwnerId
                  AND CAST(created_at AS date) = @Date
                ORDER BY created_at DESC;";

            return await connection.QueryAsync<Meal>(sql, new { OwnerId = ownerId, Date = date.Date });
        }

        public async Task<IEnumerable<Meal>> GetMealsByNameAsync(int ownerId, string name)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, name, created_at AS CreatedAt
                FROM meals
                WHERE owner_id = @OwnerId
                  AND name LIKE '%' + @Name + '%'
                ORDER BY created_at DESC;";

            return await connection.QueryAsync<Meal>(sql, new { OwnerId = ownerId, Name = name });
        }
    }
}
