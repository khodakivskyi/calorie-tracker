using backend.GraphQL.Types;
using backend.Models;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class FoodMutation : ObjectGraphType
    {
        public FoodMutation(FoodService foodService)
        {
            Name = "FoodMutations";

            Field<FoodType>("createFood")
                .Argument<IntGraphType>("userId")
                .Argument<NonNullGraphType<StringGraphType>>("name")
                .Argument<IntGraphType>("imageId")
                .Argument<DecimalGraphType>("calories")
                .Argument<DecimalGraphType>("protein")
                .Argument<DecimalGraphType>("fat")
                .Argument<DecimalGraphType>("carbohydrate")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int?>("userId");
                    var name = context.GetArgument<string>("name");
                    var imageId = context.GetArgument<int?>("imageId");
                    var calories = context.GetArgument<decimal?>("calories");
                    var protein = context.GetArgument<decimal?>("protein");
                    var fat = context.GetArgument<decimal?>("fat");
                    var carbohydrate = context.GetArgument<decimal?>("carbohydrate");

                    return await foodService.CreateFoodAsync(userId, name, imageId, false, calories, protein, fat, carbohydrate);
                });

            Field<FoodType>("updateFood")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<StringGraphType>("name")
                .Argument<IntGraphType>("imageId")
                .Argument<DecimalGraphType>("calories")
                .Argument<DecimalGraphType>("protein")
                .Argument<DecimalGraphType>("fat")
                .Argument<DecimalGraphType>("carbohydrate")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    var userId = context.GetArgument<int>("userId");
                    var name = context.GetArgument<string?>("name");
                    var imageId = context.GetArgument<int?>("imageId");
                    var calories = context.GetArgument<decimal?>("calories");
                    var protein = context.GetArgument<decimal?>("protein");
                    var fat = context.GetArgument<decimal?>("fat");
                    var carbohydrate = context.GetArgument<decimal?>("carbohydrate");

                    return await foodService.UpdateFoodAsync(foodId, userId, name, imageId, false, calories, protein, fat, carbohydrate);
                });

            Field<BooleanGraphType>("deleteFood")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    var userId = context.GetArgument<int>("userId");
                    return await foodService.DeleteFoodAsync(foodId, userId);
                });

            Field<BooleanGraphType>("deleteAllFoodsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await foodService.DeleteAllFoodsByUserAsync(userId);
                });
        }
    }
}
