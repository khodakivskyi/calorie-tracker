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
                .Argument<IntGraphType>("ownerId")
                .Argument<NonNullGraphType<DecimalGraphType>>("weight")
                .Argument<NonNullGraphType<StringGraphType>>("name")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int?>("ownerId");
                    var name = context.GetArgument<string>("name");
                    var weight = context.GetArgument<decimal>("weight");
                    return await dishService.CreateDishAsync(ownerId, name, weight, null);
                });

            Field<NonNullGraphType<DishType>>("updateDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<DecimalGraphType>("weight")
                .Argument<StringGraphType>("name")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    var name = context.GetArgument<string>("name");
                    var weight = context.GetArgument<decimal?>("weight");
                    return await dishService.UpdateDishAsync(ownerId, dishId, name, weight, null);
                });

            Field<BooleanGraphType>("deleteDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await dishService.DeleteDishAsync(dishId, ownerId);
                });

            Field<BooleanGraphType>("deleteAllDishesByUser")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await dishService.DeleteAllDishesByUserAsync(ownerId);
                });

            Field<BooleanGraphType>("addFoodToDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<DecimalGraphType>>("quantity")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    var foodId = context.GetArgument<int>("foodId");
                    var quantity = context.GetArgument<decimal>("quantity");
                    return await dishService.AddFoodToDishAsync(ownerId, dishId, foodId, quantity);
                });

            Field<BooleanGraphType>("updateFoodQuantityInDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<DecimalGraphType>>("quantity")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    var foodId = context.GetArgument<int>("foodId");
                    var quantity = context.GetArgument<decimal>("quantity");
                    return await dishService.UpdateFoodQuantityInDishAsync(ownerId, dishId, foodId, quantity);
                });

            Field<BooleanGraphType>("removeFoodFromDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    var foodId = context.GetArgument<int>("foodId");
                    return await dishService.RemoveFoodFromDishAsync(ownerId, dishId, foodId);
                });
        }
    }
}
