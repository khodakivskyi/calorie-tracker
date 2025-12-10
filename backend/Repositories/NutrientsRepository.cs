using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class NutrientsRepository : INutrientsRepository
    {
        private readonly string _connectionString;

        public NutrientsRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<Nutrients?> CreateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrate)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO nutrients (food_id, protein, fat, carbohydrate)
                                OUTPUT INSERTED.food_id AS FoodId, INSERTED.protein, INSERTED.fat, INSERTED.carbohydrate
                                VALUES (@FoodId, @Protein, @Fat, @Carbohydrate);";
            return await connection.QuerySingleOrDefaultAsync<Nutrients>(sql,
                new { FoodId = foodId, Protein = protein, Fat = fat, Carbohydrate = carbohydrate });
        }

        public async Task<Nutrients?> UpdateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrate)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE nutrients
                                SET protein = @Protein, fat = @Fat, carbohydrate = @Carbohydrate
                                OUTPUT INSERTED.food_id AS FoodId, INSERTED.protein, INSERTED.fat, INSERTED.carbohydrate
                                WHERE food_id = @FoodId;";
            return await connection.QuerySingleOrDefaultAsync<Nutrients>(sql,
                new { FoodId = foodId, Protein = protein, Fat = fat, Carbohydrate = carbohydrate });
        }

        public async Task<bool> DeleteNutrientsAsync(int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM nutrients WHERE food_id = @FoodId";
            var affectedRows = await connection.ExecuteAsync(sql, new { FoodId = foodId });
            return affectedRows > 0;
        }

        public async Task<Nutrients?> GetNutrientsByFoodAsync(int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT food_id AS FoodId, protein, fat, carbohydrate
                                FROM nutrients
                                WHERE food_id = @FoodId";
            return await connection.QuerySingleOrDefaultAsync<Nutrients>(sql, new { FoodId = foodId });
        }

        public async Task<Nutrients?> GetNutrientsByDishAsync(int dishId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT 
                    SUM(n.protein * df.weight / 100.0) AS Protein,
                    SUM(n.fat * df.weight / 100.0) AS Fat,
                    SUM(n.carbohydrate * df.weight / 100.0) AS Carbohydrate
                FROM dishes_foods df
                INNER JOIN foods f ON df.food_id = f.id
                INNER JOIN nutrients n ON n.food_id = f.id
                WHERE df.dish_id = @DishId;
            ";

            var result = await connection.QueryFirstOrDefaultAsync<(decimal Protein, decimal Fat, decimal Carbohydrate)>(sql, new { DishId = dishId });

            if (result.Protein == 0 && result.Fat == 0 && result.Carbohydrate == 0)
                return null;

            return new Nutrients(dishId, result.Protein, result.Fat, result.Carbohydrate);
        }

        public async Task<Nutrients?> GetNutrientsByMealAsync(int mealId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT 
                    SUM(n.protein * df.weight * md.weight / d.weight / 100.0) AS Protein,
                    SUM(n.fat * df.weight * md.weight / d.weight / 100.0) AS Fat,
                    SUM(n.carbohydrate * df.weight * md.weight / d.weight / 100.0) AS Carbohydrate
                FROM meals_dishes md
                JOIN dishes d ON md.dish_id = d.id
                JOIN dishes_foods df ON md.dish_id = df.dish_id
                JOIN nutrients n ON df.food_id = n.food_id
                WHERE md.meal_id = @MealId;
            ";

            var result = await connection.QueryFirstOrDefaultAsync<(decimal Protein, decimal Fat, decimal Carbohydrate)>(sql, new { MealId = mealId });

            if (result.Protein == 0 && result.Fat == 0 && result.Carbohydrate == 0)
                return null;

            return new Nutrients(mealId, result.Protein, result.Fat, result.Carbohydrate);
        }
    }
}
