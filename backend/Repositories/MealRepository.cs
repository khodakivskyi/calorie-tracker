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
    }
}
