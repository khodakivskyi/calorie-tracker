using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class DishRepository : IDishRepository
    {
        private readonly string _connectionString;
        public DishRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<Dish?> GetDishByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = "SELECT id, owner_id, name, weight, image_id, created_at FROM dishes WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Dish>(sql, new { Id = id });
        }
        public async Task<IEnumerable<Dish?>> GetAllDishesAsync(int ownerId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id, name, weight, image_id, created_at FROM dishes WHERE owner_id = @OwnerId
                        ORDER BY created_at DESC";
            return await connection.QueryAsync<Dish>(sql, new { OwnerId = ownerId });
        }
        public async Task<Dish?> CreateDishAsync(Dish dish)
        {
            throw new NotImplementedException();
        }
        public async Task<Dish?> UpdateDishAsync(Dish dish)
        {
            throw new NotImplementedException();
        }
        public async Task<bool> DeleteDishAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
