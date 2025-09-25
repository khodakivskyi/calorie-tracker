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
    }
}
