using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class CaloriesRepository : ICaloriesRepository
    {
        private readonly string _connectionString;
        public CaloriesRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<CaloriesModel?> CreateCaloriesAsync(int foodId, decimal calories)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO calories (food_id, calories)
                        OUTPUT INSERTED.food_id AS FoodId, INSERTED.calories
                        VALUES (@FoodId, @Calories);";
            return await connection.QuerySingleOrDefaultAsync<CaloriesModel>(sql, new { FoodId = foodId, Calories = calories });
        }

        public async Task<CaloriesModel?> UpdateCaloriesAsync(int foodId, decimal calories)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE calories
                        SET calories = @Calories
                        OUTPUT INSERTED.food_id AS FoodId, INSERTED.calories
                        WHERE food_id = @FoodId;";
            return await connection.QuerySingleOrDefaultAsync<CaloriesModel>(sql, new { FoodId = foodId, Calories = calories });
        }

        public async Task<bool> DeleteCaloriesAsync(int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM calories WHERE food_id = @FoodId";
            var affectedRows = await connection.ExecuteAsync(sql, new { FoodId = foodId });
            return affectedRows > 0;
        }

        public async Task<CaloriesModel?> GetCaloriesByFoodAsync(int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT food_id AS FoodId, calories
                        FROM calories
                        WHERE food_id = @FoodId";
            return await connection.QuerySingleOrDefaultAsync<CaloriesModel>(sql, new { FoodId = foodId });
        }

        public async Task<CaloriesModel?> GetCaloriesByDishAsync(int dishId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT ISNULL(SUM(c.calories * df.quantity / 100.0), 0) as Calories
                                FROM dishes_foods df
                                INNER JOIN foods f ON df.food_id = f.id
                                INNER JOIN calories c ON c.food_id = f.id
                                WHERE df.dish_id = @DishId";
            
            var result = await connection.QueryFirstOrDefaultAsync<decimal>(sql, new { DishId = dishId });
            return new CaloriesModel(dishId, result);
        }

        public async Task<CaloriesModel?> GetCaloriesByMealAsync(int mealId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT ISNULL(SUM(
                    (
                        CASE 
                            WHEN c.calories IS NOT NULL THEN c.calories
                            ELSE (n.protein * 4 + n.fat * 9 + n.carbohydrates * 4)
                        END
                    ) * (df.quantity / 100.0) * (md.quantity / 100.0)
                ), 0) AS Calories
                FROM meals_dishes md
                INNER JOIN dishes_foods df ON md.dish_id = df.dish_id
                INNER JOIN foods f ON df.food_id = f.id
                LEFT JOIN calories c ON c.food_id = f.id
                LEFT JOIN nutrients n ON n.food_id = f.id
                WHERE md.meal_id = @MealId;
            ";

            var result = await connection.QueryFirstOrDefaultAsync<decimal>(sql, new { MealId = mealId });
            return new CaloriesModel(mealId, result);
        }
    }
}
