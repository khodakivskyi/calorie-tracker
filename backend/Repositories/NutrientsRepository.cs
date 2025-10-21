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

        // crud
        public async Task<Nutrients?> GetNutrientsByFoodIdAsync(int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT food_id AS FoodId, protein, fat, carbohydrates
                                FROM nutrients
                                WHERE food_id = @FoodId";
            return await connection.QuerySingleOrDefaultAsync<Nutrients>(sql, new { FoodId = foodId });
        }

        public async Task<Nutrients?> CreateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO nutrients (food_id, protein, fat, carbohydrates)
                                OUTPUT INSERTED.food_id AS FoodId, INSERTED.protein, INSERTED.fat, INSERTED.carbohydrates
                                VALUES (@FoodId, @Protein, @Fat, @Carbohydrates);";
            return await connection.QuerySingleOrDefaultAsync<Nutrients>(sql,
                new { FoodId = foodId, Protein = protein, Fat = fat, Carbohydrates = carbohydrates });
        }

        public async Task<Nutrients?> UpdateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE nutrients
                                SET protein = @Protein, fat = @Fat, carbohydrates = @Carbohydrates
                                OUTPUT INSERTED.food_id AS FoodId, INSERTED.protein, INSERTED.fat, INSERTED.carbohydrates
                                WHERE food_id = @FoodId;";
            return await connection.QuerySingleOrDefaultAsync<Nutrients>(sql,
                new { FoodId = foodId, Protein = protein, Fat = fat, Carbohydrates = carbohydrates });
        }

        public async Task<bool> DeleteNutrientsAsync(int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM nutrients WHERE food_id = @FoodId";
            var affectedRows = await connection.ExecuteAsync(sql, new { FoodId = foodId });
            return affectedRows > 0;
        }
    }
}
