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
        }
    }
}
