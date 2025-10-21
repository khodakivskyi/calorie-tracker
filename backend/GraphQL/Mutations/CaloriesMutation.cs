using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class CaloriesMutation : ObjectGraphType
    {
        public CaloriesMutation(CaloriesService caloriesService)
        {
            Name = "CaloriesMutations";

            Field<CaloriesType>("createCalories")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<DecimalGraphType>>("calories")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    var calories = context.GetArgument<decimal>("calories");
                    return await caloriesService.CreateCaloriesAsync(foodId, calories);
                });

            Field<CaloriesType>("updateCalories")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<DecimalGraphType>>("calories")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    var calories = context.GetArgument<decimal>("calories");
                    return await caloriesService.UpdateCaloriesAsync(foodId, calories);
                });

            Field<BooleanGraphType>("deleteCalories")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    return await caloriesService.DeleteCaloriesAsync(foodId);
                });
        }
    }
}
