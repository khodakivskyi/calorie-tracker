using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class CaloriesQuery : ObjectGraphType
    {
        public CaloriesQuery(CaloriesService caloriesService)
        {
            Name = "CaloriesQueries";

            Field<CaloriesType>("getCaloriesByFood")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    return await caloriesService.GetCaloriesByFoodAsync(foodId);
                });
        }
    }
}
