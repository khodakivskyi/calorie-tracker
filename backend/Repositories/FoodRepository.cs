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

        // Returns all types
        public async Task<Food?> GetFoodByIdAsync(int foodId, int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, is_external AS IsExternal
                                 FROM foods 
                                 WHERE id = @Id AND (owner_id = @UserId OR owner_id IS NULL)";
            return await connection.QuerySingleOrDefaultAsync<Food>(sql, new { Id = foodId, UserId = userId });
        }

        public async Task<IEnumerable<Food>> GetFoodsByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, is_external AS IsExternal
                                 FROM foods 
                                 WHERE owner_id = @UserId OR owner_id IS NULL
                                 ORDER BY 
                                    CASE WHEN owner_id = @UserId THEN 0 ELSE 1 END,
                                    created_at DESC";
            return await connection.QueryAsync<Food>(sql, new { UserId = userId });
        }

        // Only for global foods
        public async Task<IEnumerable<Food>> GetGlobalFoodsAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, is_external AS IsExternal
                                 FROM foods 
                                 WHERE owner_id IS NULL
                                 ORDER BY created_at DESC";
            return await connection.QueryAsync<Food>(sql);
        }

        // Only for private foods
        public async Task<IEnumerable<Food>> GetPrivateFoodsByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, image_id AS ImageId, 
                                        created_at AS CreatedAt, updated_at AS UpdatedAt, is_external AS IsExternal
                                 FROM foods 
                                 WHERE owner_id = @UserId
                                 ORDER BY created_at DESC";
            return await connection.QueryAsync<Food>(sql, new { UserId = userId });
        }

        public async Task<Food?> CreateFoodAsync(Food food)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                INSERT INTO foods (owner_id, name, image_id, is_external)
                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, 
                       INSERTED.image_id AS ImageId, INSERTED.created_at AS CreatedAt,
                       INSERTED.updated_at AS UpdatedAt, INSERTED.is_external AS IsExternal
                VALUES (@OwnerId, @Name, @ImageId, @IsExternal);";

            return await connection.QuerySingleOrDefaultAsync<Food>(sql, food);
        }

        public async Task<Food?> UpdateFoodAsync(Food food)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                UPDATE foods
                SET name = @Name,
                    image_id = @ImageId,
                    is_external = @IsExternal,
                    updated_at = GETDATE()
                OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, 
                       INSERTED.image_id AS ImageId, INSERTED.created_at AS CreatedAt,
                       INSERTED.updated_at AS UpdatedAt, INSERTED.is_external AS IsExternal
                WHERE id = @Id AND owner_id = @OwnerId;";

            return await connection.QueryFirstOrDefaultAsync<Food>(sql, food);
        }

        public async Task<bool> DeleteFoodAsync(int foodId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "DELETE FROM foods WHERE id = @Id"; ;
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = foodId });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAllFoodsByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM dishes_foods WHERE food_id IN (SELECT id FROM foods WHERE owner_id = @UserId);
                                DELETE FROM foods WHERE owner_id = @UserId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { UserId = userId });
            return affectedRows > 0;
        }
    }
}
