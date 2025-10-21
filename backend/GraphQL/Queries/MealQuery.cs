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
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await mealService.GetMealByIdAsync(id);
                });

            Field<ListGraphType<MealType>>("getMealsByOwner")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await mealService.GetAllMealsByUserAsync(ownerId);
                });


            Field<ListGraphType<ObjectGraphType>>("getDishesByMeal")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .ResolveAsync(async context =>
                {
                    var mealId = context.GetArgument<int>("mealId");
                    var dishes = await mealService.GetDishesByMealAsync(mealId);
                    return dishes.Select(d => new { d.DishId, d.Quantity });
                });

            Field<DecimalGraphType>("getMealTotalCalories")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .ResolveAsync(async context =>
                {
                    var mealId = context.GetArgument<int>("mealId");
                    return await mealService.GetMealTotalCaloriesAsync(mealId);
                });

            Field<ObjectGraphType>("getMealTotalNutrients")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .ResolveAsync(async context =>
                {
                    var mealId = context.GetArgument<int>("mealId");
                    var nutrients = await mealService.GetMealTotalNutrientsAsync(mealId);
                    return new { nutrients?.Protein, nutrients?.Fat, nutrients?.Carbohydrates };
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

            Field<ListGraphType<ObjectGraphType>>("getWeeklyCalories")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<DateGraphType>>("startDate")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var startDate = context.GetArgument<DateTime>("startDate");
                    var weekly = await mealService.GetWeeklyCaloriesAsync(ownerId, startDate);
                    return weekly.Select(kv => new { Date = kv.Key, TotalCalories = kv.Value });
                });

            Field<ListGraphType<ObjectGraphType>>("getMonthlyCalories")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<IntGraphType>>("year")
                .Argument<NonNullGraphType<IntGraphType>>("month")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var year = context.GetArgument<int>("year");
                    var month = context.GetArgument<int>("month");
                    var monthly = await mealService.GetMonthlyCaloriesAsync(ownerId, year, month);
                    return monthly.Select(kv => new { Date = kv.Key, TotalCalories = kv.Value });
                });
        }
    }
}
