using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class DishMutation : ObjectGraphType
    {
        public DishMutation(DishService dishService)
        {
            Name = "DishMutations";

            Field<NonNullGraphType<DishType>>("createDish")
                .Argument<IntGraphType>("userId")
                .Argument<NonNullGraphType<DecimalGraphType>>("weight")
                .Argument<NonNullGraphType<StringGraphType>>("name")
                .Argument<StringGraphType>("externalId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int?>("userId");
                    var name = context.GetArgument<string>("name");
                    var weight = context.GetArgument<decimal>("weight");
                    var externalId = context.GetArgument<string>("externalId");
                    return await dishService.CreateDishAsync(userId, name, weight, null, externalId);
                });

            Field<NonNullGraphType<DishType>>("updateDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<DecimalGraphType>("weight")
                .Argument<StringGraphType>("name")
                .Argument<StringGraphType>("externalId")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var userId = context.GetArgument<int>("userId");
                    var name = context.GetArgument<string>("name");
                    var weight = context.GetArgument<decimal?>("weight");
                    var externalId = context.GetArgument<string>("externalId");
                    return await dishService.UpdateDishAsync(userId, dishId, name, weight, null, externalId);
                });

            Field<BooleanGraphType>("deleteDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var userId = context.GetArgument<int>("userId");
                    return await dishService.DeleteDishAsync(userId, dishId);
                });

            Field<BooleanGraphType>("deleteAllDishesByUser")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await dishService.DeleteAllDishesByUserAsync(userId);
                });

            Field<BooleanGraphType>("addFoodToDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<DecimalGraphType>>("quantity")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var userId = context.GetArgument<int>("userId");
                    var foodId = context.GetArgument<int>("foodId");
                    var quantity = context.GetArgument<decimal>("quantity");
                    return await dishService.AddFoodToDishAsync(userId, dishId, foodId, quantity);
                });

            Field<BooleanGraphType>("updateFoodQuantityInDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<DecimalGraphType>>("quantity")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var userId = context.GetArgument<int>("userId");
                    var foodId = context.GetArgument<int>("foodId");
                    var quantity = context.GetArgument<decimal>("quantity");
                    return await dishService.UpdateFoodQuantityInDishAsync(userId, dishId, foodId, quantity);
                });

            Field<BooleanGraphType>("removeFoodFromDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var userId = context.GetArgument<int>("userId");
                    var foodId = context.GetArgument<int>("foodId");
                    return await dishService.RemoveFoodFromDishAsync(userId, dishId, foodId);
                });
        }
    }
}
