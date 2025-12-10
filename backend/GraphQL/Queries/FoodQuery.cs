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
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await foodService.GetFoodByIdAsync(foodId, ownerId);
                });

            Field<ListGraphType<FoodType>>("getFoodsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await foodService.GetFoodsByUserAsync(ownerId);
                });

            Field<ListGraphType<FoodType>>("getPrivateFoodsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await foodService.GetPrivateFoodsByUserAsync(ownerId);
                });

            Field<ListGraphType<FoodType>>("getGlobalFoods")
                .ResolveAsync(async context =>
                {
                    return await foodService.GetGlobalFoodsAsync();
                });
        }
    }
}
