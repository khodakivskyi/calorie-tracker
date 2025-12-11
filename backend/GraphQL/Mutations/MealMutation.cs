using backend.GraphQL.Types;
using backend.Models;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class MealMutation : ObjectGraphType
    {
        public MealMutation(MealService mealService)
        {
            Name = "MealMutations";

            Field<NonNullGraphType<Types.MealType>>("createMeal")
                .Argument<NonNullGraphType<CreateMealInputType>>("input")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<CreateMealInput>("input");

                    var dishes = input.Dishes?
                        .Select(d => (d.DishId, d.Weight))
                        .ToList() ?? new List<(int dishId, decimal weight)>();

                    return await mealService.CreateMealAsync(input.OwnerId, input.TypeId, input.Name, dishes);
                });

            Field<NonNullGraphType<Types.MealType>>("updateMeal")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<StringGraphType>>("name")
                .ResolveAsync(async context =>
                {
                    var mealId = context.GetArgument<int>("mealId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    var name = context.GetArgument<string>("name");
                    return await mealService.UpdateMealAsync(mealId, ownerId, name);
                });

            Field<BooleanGraphType>("deleteMeal")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var mealId = context.GetArgument<int>("mealId");
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await mealService.DeleteMealAsync(mealId, ownerId);
                });

            Field<BooleanGraphType>("deleteAllMealsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await mealService.DeleteAllMealsByUserAsync(ownerId);
                });


            Field<BooleanGraphType>("addDishToMeal")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<DecimalGraphType>>("weight")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var mealId = context.GetArgument<int>("mealId");
                    var dishId = context.GetArgument<int>("dishId");
                    var weight = context.GetArgument<decimal>("weight");
                    return await mealService.AddDishToMealAsync(ownerId, mealId, dishId, weight);
                });

            Field<BooleanGraphType>("updateDishWeightInMeal")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<DecimalGraphType>>("weight")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var mealId = context.GetArgument<int>("mealId");
                    var dishId = context.GetArgument<int>("dishId");
                    var weight = context.GetArgument<decimal>("weight");
                    return await mealService.UpdateDishWeightInMealAsync(ownerId, mealId, dishId, weight);
                });

            Field<BooleanGraphType>("removeDishFromMeal")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var mealId = context.GetArgument<int>("mealId");
                    var dishId = context.GetArgument<int>("dishId");
                    return await mealService.RemoveDishFromMealAsync(ownerId, mealId, dishId);
                });
        }
    }
}
