using backend.Models;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class FoodRepository
    {
        private readonly string _connectionString;

        public FoodRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<Food?> GetFoodByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "SELECT id, owner_id AS OwnerId, name, image_id AS ImageId, created_at AS CreatedAt, source, external_id AS ExternalId FROM foods WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Food>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Food>> GetFoodsByOwnerAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, image_id AS ImageId, created_at AS CreatedAt, source, external_id AS ExternalId FROM foods WHERE owner_id = @OwnerId";
            return await connection.QueryAsync<Food>(sql, new { OwnerId = ownerId });
        }

        public async Task<Food?> CreateFoodAsync(Food food)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO foods (owner_id, name, image_id, source, external_id)
                VALUES (@OwnerId, @Name, @ImageId, @Source, @ExternalId);
                SELECT CAST(SCOPE_IDENTITY() as int)";

            var foodId = await connection.QuerySingleAsync<int>(sql, food);

            return await GetFoodByIdAsync(foodId);
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
                WHERE id = @Id";

            var affectedRows = await connection.ExecuteAsync(sql, food);

            if (affectedRows > 0)
                return await GetFoodByIdAsync(food.Id);
            else return null;
        }

        public async Task<bool> DeleteFoodAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM foods WHERE id = @Id";
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }
    }
}
