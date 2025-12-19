using backend.GraphQL.Types;
using backend.Models;
using backend.Services;
using GraphQL;
using GraphQL.Types;
using Sprache;

namespace backend.GraphQL.Mutations
{
    public class DishMutation : ObjectGraphType
    {
        public DishMutation(DishService dishService)
        {
            Name = "DishMutations";

            Field<NonNullGraphType<DishType>>("createDish")
                 .Argument<NonNullGraphType<CreateDishInputType>>("input")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<CreateDishInput>("input");

                    var foods = input.Foods?
                       .Select(f => (f.FoodId, f.Weight))
                       .ToList();
                    return await dishService.CreateDishAsync(input.OwnerId, input.Name, input.Weight, input.ImageId, foods);
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
                .Argument<NonNullGraphType<DecimalGraphType>>("weight")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    var foodId = context.GetArgument<int>("foodId");
                    var weight = context.GetArgument<decimal>("weight");
                    return await dishService.AddFoodToDishAsync(ownerId, dishId, foodId, weight);
                });

            Field<BooleanGraphType>("updateFoodWeightInDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<DecimalGraphType>>("weight")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    var foodId = context.GetArgument<int>("foodId");
                    var weight = context.GetArgument<decimal>("weight");
                    return await dishService.UpdateFoodWeightInDishAsync(ownerId, dishId, foodId, weight);
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
