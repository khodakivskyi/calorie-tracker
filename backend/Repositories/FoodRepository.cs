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

        public async Task<Food> CreateFoodAsync(Food food)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO foods (owner_id, name, image_id, source, external_id, created_at)
                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, 
                       INSERTED.image_id AS ImageId, INSERTED.created_at AS CreatedAt,
                       INSERTED.source, INSERTED.external_id AS ExternalId
                VALUES (@OwnerId, @Name, @ImageId, @Source, @ExternalId, SYSUTCDATETIME());";

            return await connection.QuerySingleAsync<Food>(sql, food);
            
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
            const string sql = "DELETE FROM foods WHERE owner_id = @OwnerId";
            var affectedRows = await connection.ExecuteAsync(sql, new { OwnerId = ownerId });
            return affectedRows > 0;
        }
    }
}
