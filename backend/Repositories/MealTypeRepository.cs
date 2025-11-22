using backend.Models;
using backend.Repositories.Interfaces;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Repositories
{
    public class MealTypeRepository : IMealTypeRepository
    {
        private readonly string _connectionString;

        public MealTypeRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<MealType?> GetMealTypeByIdAsync(int mealTypeId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, name 
                                 FROM meal_types WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<MealType>(sql, new { Id = mealTypeId });
        }
    }
}
