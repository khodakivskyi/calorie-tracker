using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class FoodRepository : IFoodRepository
    {
        private readonly string _connectionString;

        public FoodRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<Food?> GetFoodByIdAsync(int id, int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, image_id AS ImageId, 
                                        created_at AS CreatedAt, source, external_id AS ExternalId
                                 FROM foods 
                                 WHERE id = @Id AND owner_id = @OwnerId";
            return await connection.QuerySingleOrDefaultAsync<Food>(sql, new { Id = id, OwnerId = ownerId });
        }

        public async Task<IEnumerable<Food>> GetFoodsByOwnerAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, image_id AS ImageId, 
                                        created_at AS CreatedAt, source, external_id AS ExternalId
                                 FROM foods 
                                 WHERE owner_id = @OwnerId
                                 ORDER BY created_at DESC";
            return await connection.QueryAsync<Food>(sql, new { OwnerId = ownerId });
        }

        public async Task<Food?> CreateFoodAsync(Food food)
        {
            Console.WriteLine(food.Name);
                            Console.WriteLine(food.Source);
                            Console.WriteLine(food.CreatedAt);
                            Console.WriteLine(food.Id);


            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO foods (owner_id, name, image_id, source, external_id, created_at)
                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, 
                       INSERTED.image_id AS ImageId, INSERTED.created_at AS CreatedAt,
                       INSERTED.source, INSERTED.external_id AS ExternalId
                VALUES (@OwnerId, @Name, @ImageId, @Source, @ExternalId, SYSUTCDATETIME());";

            return await connection.QuerySingleOrDefaultAsync<Food>(sql, food);
        }

        public async Task<Food?> UpdateFoodAsync(Food food)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                UPDATE foods
                SET name = @Name,
                    image_id = @ImageId,
                    source = @Source,
                    external_id = @ExternalId
                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, 
                       INSERTED.image_id AS ImageId, INSERTED.created_at AS CreatedAt,
                       INSERTED.source, INSERTED.external_id AS ExternalId
                WHERE id = @Id AND owner_id = @OwnerId;";

            return await connection.QuerySingleOrDefaultAsync<Food>(sql, food);
        }

        public async Task<bool> DeleteFoodAsync(int id, int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM foods WHERE id = @Id AND owner_id = @OwnerId"; ;
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = id, OwnerId = ownerId });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAllFoodsByUserAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM dishes_foods WHERE food_id IN (SELECT id FROM foods WHERE owner_id = @OwnerId);
                                DELETE FROM foods WHERE owner_id = @OwnerId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { OwnerId = ownerId });
            return affectedRows > 0;
        }

        // === Calories methods ===
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

        // === Nutrients methods ===
        public async Task<Nutrients?> GetNutrientsByFoodIdAsync(int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, protein, fat, carbohydrates, food_id AS FoodId
                                FROM nutrients
                                WHERE food_id = @FoodId";
            return await connection.QuerySingleOrDefaultAsync<Nutrients>(sql, new { FoodId = foodId });
        }

        public async Task<Nutrients?> CreateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO nutrients (food_id, protein, fat, carbohydrates)
                                OUTPUT INSERTED.id, INSERTED.protein, INSERTED.fat, INSERTED.carbohydrates, INSERTED.food_id AS FoodId
                                VALUES (@FoodId, @Protein, @Fat, @Carbohydrates);";
            return await connection.QuerySingleOrDefaultAsync<Nutrients>(sql, 
                new { FoodId = foodId, Protein = protein, Fat = fat, Carbohydrates = carbohydrates });
        }

        public async Task<Nutrients?> UpdateNutrientsAsync(int foodId, decimal protein, decimal fat, decimal carbohydrates)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE nutrients
                                SET protein = @Protein, fat = @Fat, carbohydrates = @Carbohydrates
                                OUTPUT INSERTED.id, INSERTED.protein, INSERTED.fat, INSERTED.carbohydrates, INSERTED.food_id AS FoodId
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

        // === Aggregated method ===
        public async Task<(Food food, CaloriesModel? calories, Nutrients? nutrients)?> GetFoodWithDetailsAsync(int id, int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            
            const string foodSql = @"SELECT id, owner_id AS OwnerId, name, image_id AS ImageId, 
                                           created_at AS CreatedAt, source, external_id AS ExternalId
                                    FROM foods 
                                    WHERE id = @Id AND owner_id = @OwnerId";
            var food = await connection.QuerySingleOrDefaultAsync<Food>(foodSql, new { Id = id, OwnerId = ownerId });
            if (food == null)
                return null;

            const string caloriesSql = @"SELECT id, calories, food_id AS FoodId
                                        FROM calories
                                        WHERE food_id = @FoodId";
            var calories = await connection.QuerySingleOrDefaultAsync<CaloriesModel>(caloriesSql, new { FoodId = id });

            const string nutrientsSql = @"SELECT id, protein, fat, carbohydrates, food_id AS FoodId
                                         FROM nutrients
                                         WHERE food_id = @FoodId";
            var nutrients = await connection.QuerySingleOrDefaultAsync<Nutrients>(nutrientsSql, new { FoodId = id });

            return (food, calories, nutrients);
        }
    }
}
