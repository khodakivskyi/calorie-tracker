using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class MealQuery : ObjectGraphType
    {
        public MealQuery(MealService mealService)
        {
            Field<MealType>("getMealById")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .ResolveAsync(async context =>
                {
                    var mealId = context.GetArgument<int>("mealId");
                    return await mealService.GetMealByIdAsync(mealId);
                });

            Field<ListGraphType<MealType>>("getMealsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await mealService.GetMealsByUserAsync(ownerId);
                });

            Field<ListGraphType<MealDishType>>("getDishesByMeal")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .ResolveAsync(async context =>
                {
                    var mealId = context.GetArgument<int>("mealId");
                    var dishes = await mealService.GetDishesByMealAsync(mealId);
                    return dishes.Select(d => new { dishId = d.DishId, weight = d.Weight });
                });

            Field<DecimalGraphType>("getDailyCalories")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<DateGraphType>>("date")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var date = context.GetArgument<DateTime>("date");
                    return await mealService.GetDailyCaloriesAsync(ownerId, date);
                });

            Field<ListGraphType<CaloriesDataType>>("getWeeklyCalories")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<DateGraphType>>("startDate")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var startDate = context.GetArgument<DateTime>("startDate");
                    var weekly = await mealService.GetWeeklyCaloriesAsync(ownerId, startDate);
                    return weekly.Select(kv => new { date = kv.Key, totalCalories = kv.Value });
                });

            Field<ListGraphType<CaloriesDataType>>("getMonthlyCalories")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<IntGraphType>>("year")
                .Argument<NonNullGraphType<IntGraphType>>("month")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var year = context.GetArgument<int>("year");
                    var month = context.GetArgument<int>("month");
                    var monthly = await mealService.GetMonthlyCaloriesAsync(ownerId, year, month);
                    return monthly.Select(kv => new { date = kv.Key, totalCalories = kv.Value });
                });
        }
    }
}
