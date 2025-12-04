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
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    var userId = context.GetArgument<int>("userId");
                    return await foodService.GetFoodByIdAsync(foodId, userId);
                });

            Field<ListGraphType<FoodType>>("getFoodsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await foodService.GetFoodsByUserAsync(userId);
                });

            Field<ListGraphType<FoodType>>("getPrivateFoodsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await foodService.GetPrivateFoodsByUserAsync(userId);
                });

            Field<ListGraphType<FoodType>>("getGlobalFoods")
                .ResolveAsync(async context =>
                {
                    return await foodService.GetGlobalFoodsAsync();
                });
        }
    }
}
