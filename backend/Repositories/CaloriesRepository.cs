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
        public async Task<CaloriesModel?> GetCaloriesByFoodIdAsync(int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, calories, food_id AS FoodId
                        FROM calories
                        WHERE food_id = @FoodId";
            return await connection.QuerySingleOrDefaultAsync<CaloriesModel>(sql, new { FoodId = foodId });
        }

        public async Task<CaloriesModel?> CreateCaloriesAsync(int foodId, decimal calories)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO calories (food_id, calories)
                        OUTPUT INSERTED.id, INSERTED.calories, INSERTED.food_id AS FoodId
                        VALUES (@FoodId, @Calories);";
            return await connection.QuerySingleOrDefaultAsync<CaloriesModel>(sql, new { FoodId = foodId, Calories = calories });
        }

        public async Task<CaloriesModel?> UpdateCaloriesAsync(int foodId, decimal calories)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE calories
                        SET calories = @Calories
                        OUTPUT INSERTED.id, INSERTED.calories, INSERTED.food_id AS FoodId
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
    }
}
