using backend.Exceptions;
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

        // crud
        public async Task<Meal?> GetMealByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, meal_type_id AS TypeId, created_at AS CreatedAt, updated_at AS UpdatedAt 
                                 FROM meals WHERE id = @Id";
            return await connection.QueryFirstOrDefaultAsync<Meal>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Meal>> GetMealsByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT id, owner_id AS OwnerId, name, meal_type_id AS TypeId, created_at AS CreatedAt, updated_at AS UpdatedAt
                                 FROM meals
                                 WHERE owner_id = @UserId
                                 ORDER BY created_at DESC";
            return await connection.QueryAsync<Meal>(sql, new { UserId = userId });
        }

        public async Task<Meal?> CreateMealAsync(Meal meal, List<(int dishId, decimal weight)> dishesList)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                const string mealSql = @"INSERT INTO meals (owner_id, meal_type_id, name)
                                       OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, 
                                              INSERTED.created_at AS CreatedAt, INSERTED.updated_at AS UpdatedAt, 
                                              INSERTED.meal_type_id AS TypeId
                                       VALUES (@OwnerId, @TypeId, @Name);";

                var createdMeal = await connection.QueryFirstOrDefaultAsync<Meal>(
                    mealSql,
                    meal,
                    transaction);

                if (createdMeal == null)
                {
                    throw new InvalidOperationException("Failed to create meal");
                }

                if (dishesList.Any())
                {
                    const string dishesSql = @"INSERT INTO meals_dishes (meal_id, dish_id, weight)
                                               VALUES (@MealId, @DishId, @Weight);";

                    var dishesParams = dishesList.Select(d => new
                    {
                        MealId = createdMeal.Id,
                        DishId = d.dishId,
                        Weight = d.weight
                    });

                    await connection.ExecuteAsync(dishesSql, dishesParams, transaction);
                }

                transaction.Commit();
                return createdMeal;
            }
            catch (Exception ex)
            {
                transaction.Rollback();

                if (ex is ValidationException || ex is InvalidOperationException)
                    throw;

                throw new InvalidOperationException($"Failed to create meal with dishes: {ex.Message}", ex);
            }
        }

        public async Task<Meal?> UpdateMealAsync(Meal meal)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE meals
                                 SET name = @Name, updated_at = GETDATE()
                                 OUTPUT INSERTED.id, INSERTED.owner_id AS OwnerId, INSERTED.name, 
                                        INSERTED.meal_type_id AS TypeId, INSERTED.created_at AS CreatedAt, INSERTED.updated_at AS UpdatedAt
                                 WHERE id = @Id;";
            return await connection.QueryFirstOrDefaultAsync<Meal>(sql, meal);
        }

        public async Task<bool> DeleteMealAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM meals_dishes WHERE meal_id = @Id;
                                 DELETE FROM meals WHERE id = @Id";
            var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAllMealsByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM meals_dishes WHERE meal_id IN (SELECT id FROM meals WHERE owner_id = @UserId);
                                 DELETE FROM meals WHERE owner_id = @UserId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { UserId = userId });
            return affectedRows > 0;
        }

        // Meal-Dish relationship
        public async Task<bool> AddDishToMealAsync(int mealId, int dishId, decimal weight)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"INSERT INTO meals_dishes (meal_id, dish_id, weight)
                                 VALUES (@MealId, @DishId, @Weight);";
            var affectedRows = await connection.ExecuteAsync(sql, new { MealId = mealId, DishId = dishId, Weight = weight });
            return affectedRows > 0;
        }

        public async Task<bool> UpdateDishWeightInMealAsync(int mealId, int dishId, decimal weight)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"UPDATE meals_dishes
                                 SET weight = @Weight
                                 WHERE meal_id = @MealId AND dish_id = @DishId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { MealId = mealId, DishId = dishId, Weight = weight });
            return affectedRows > 0;
        }

        public async Task<bool> RemoveDishFromMealAsync(int mealId, int dishId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"DELETE FROM meals_dishes
                                 WHERE meal_id = @MealId AND dish_id = @DishId;";
            var affectedRows = await connection.ExecuteAsync(sql, new { MealId = mealId, DishId = dishId });
            return affectedRows > 0;
        }

        public async Task<IEnumerable<MealDishDto>> GetDishesByMealAsync(int mealId)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"SELECT meal_id AS MealId, dish_id AS DishId, weight AS Weight
                                 FROM meals_dishes
                                 WHERE meal_id = @MealId;";
            return await connection.QueryAsync<MealDishDto>(sql, new { MealId = mealId });
        }

        // Query by date/name
        public async Task<IEnumerable<Meal>> GetMealsByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, name, meal_type_id AS TypeId, created_at AS CreatedAt, updated_at AS UpdatedAt
                FROM meals
                WHERE owner_id = @UserId
                  AND CAST(created_at AS date) BETWEEN @StartDate AND @EndDate
                ORDER BY created_at DESC;";

            return await connection.QueryAsync<Meal>(sql, new { UserId = userId, StartDate = startDate.Date, EndDate = endDate.Date });
        }

        public async Task<IEnumerable<Meal>> GetMealsByDateAsync(int userId, DateTime date)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, name, meal_type_id AS TypeId, created_at AS CreatedAt, updated_at AS UpdatedAt
                FROM meals
                WHERE owner_id = @UserId
                  AND CAST(created_at AS date) = @Date
                ORDER BY created_at DESC;";

            return await connection.QueryAsync<Meal>(sql, new { UserId = userId, Date = date.Date });
        }

        public async Task<IEnumerable<Meal>> GetMealsByNameAsync(int userId, string name)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT id, owner_id AS OwnerId, name, meal_type_id AS TypeId, created_at AS CreatedAt, updated_at AS UpdatedAt
                FROM meals
                WHERE owner_id = @UserId
                  AND name LIKE '%' + @Name + '%'
                ORDER BY created_at DESC;";

            return await connection.QueryAsync<Meal>(sql, new { UserId = userId, Name = name });
        }

        // Analytics
        public async Task<decimal> GetDailyCaloriesAsync(int userId, DateTime date)
        {
            using var connection = new SqlConnection(_connectionString);
            const string sql = @"
                SELECT ISNULL(SUM(
                    (
                        CASE 
                            WHEN c.calories IS NOT NULL THEN c.calories
                            ELSE (n.protein * 4 + n.fat * 9 + n.carbohydrate * 4)
                        END
                    ) * df.weight * md.weight / d.weight / 100.0
                ), 0) AS TotalCalories
                FROM meals m
                INNER JOIN meals_dishes md ON m.id = md.meal_id
                INNER JOIN dishes d ON md.dish_id = d.id
                INNER JOIN dishes_foods df ON md.dish_id = df.dish_id
                INNER JOIN foods f ON df.food_id = f.id
                LEFT JOIN calories c ON c.food_id = f.id
                LEFT JOIN nutrients n ON n.food_id = f.id
                WHERE m.owner_id = @UserId
                  AND CAST(m.created_at AS date) = @Date;
            ";

            return await connection.QueryFirstOrDefaultAsync<decimal>(sql, new { UserId = userId, Date = date.Date });
        }


        public async Task<Dictionary<DateTime, decimal>> GetWeeklyCaloriesAsync(int userId, DateTime startDate)
        {
            using var connection = new SqlConnection(_connectionString);
            var endDate = startDate.AddDays(6);

            const string sql = @"
                SELECT 
                    CAST(m.created_at AS date) AS [Date],
                    ISNULL(SUM(
                        (
                            CASE 
                                WHEN c.calories IS NOT NULL THEN c.calories
                                ELSE (n.protein * 4 + n.fat * 9 + n.carbohydrate * 4)
                            END
                        ) * df.weight * md.weight / d.weight / 100.0
                    ), 0) AS TotalCalories
                FROM meals m
                INNER JOIN meals_dishes md ON m.id = md.meal_id
                INNER JOIN dishes d ON md.dish_id = d.id
                INNER JOIN dishes_foods df ON md.dish_id = df.dish_id
                INNER JOIN foods f ON df.food_id = f.id
                LEFT JOIN calories c ON c.food_id = f.id
                LEFT JOIN nutrients n ON n.food_id = f.id
                WHERE m.owner_id = @UserId
                  AND CAST(m.created_at AS date) BETWEEN @StartDate AND @EndDate
                GROUP BY CAST(m.created_at AS date)
                ORDER BY [Date];
            ";

            var result = await connection.QueryAsync<(DateTime Date, decimal TotalCalories)>(
                sql, new { UserId = userId, StartDate = startDate.Date, EndDate = endDate.Date });

            return result.ToDictionary(x => x.Date, x => x.TotalCalories);
        }


        public async Task<Dictionary<DateTime, decimal>> GetMonthlyCaloriesAsync(int userId, int year, int month)
        {
            using var connection = new SqlConnection(_connectionString);
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            const string sql = @"
                SELECT 
                    CAST(m.created_at AS date) AS [Date],
                    ISNULL(SUM(
                        (
                            CASE 
                                WHEN c.calories IS NOT NULL THEN c.calories
                                ELSE (n.protein * 4 + n.fat * 9 + n.carbohydrate * 4)
                            END
                        ) * df.weight * md.weight / d.weight / 100.0
                    ), 0) AS TotalCalories
                FROM meals m
                INNER JOIN meals_dishes md ON m.id = md.meal_id
                INNER JOIN dishes d ON md.dish_id = d.id
                INNER JOIN dishes_foods df ON md.dish_id = df.dish_id
                INNER JOIN foods f ON df.food_id = f.id
                LEFT JOIN calories c ON c.food_id = f.id
                LEFT JOIN nutrients n ON n.food_id = f.id
                WHERE m.owner_id = @UserId
                  AND YEAR(m.created_at) = @Year
                  AND MONTH(m.created_at) = @Month
                GROUP BY CAST(m.created_at AS date)
                ORDER BY [Date];
            ";

            var result = await connection.QueryAsync<(DateTime Date, decimal TotalCalories)>(
                sql, new { UserId = userId, Year = year, Month = month });

            return result.ToDictionary(x => x.Date, x => x.TotalCalories);
        }

    }
}
