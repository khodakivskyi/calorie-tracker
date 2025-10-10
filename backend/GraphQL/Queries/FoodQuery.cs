using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class FoodQuery : ObjectGraphType
    {
        public FoodQuery(FoodService foodService)
        {
            Field<FoodType>("getFoodById")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await foodService.GetFoodByIdAsync(id, ownerId);
                });

            Field<ListGraphType<FoodType>>("getFoodsByOwner")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await foodService.GetFoodsByOwnerAsync(ownerId);
                });

            Field<DecimalGraphType>("getFoodCalories")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    var calories = await foodService.GetFoodCaloriesAsync(foodId);
                    return calories ?? 0m;
                });
        }
    }
}
