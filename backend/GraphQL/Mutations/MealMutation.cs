using backend.GraphQL.Types;
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

            Field<NonNullGraphType<MealType>>("createMeal")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<NonNullGraphType<StringGraphType>>("name")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var name = context.GetArgument<string>("name");
                    return await mealService.CreateMealAsync(userId, name);
                });

            Field<NonNullGraphType<MealType>>("updateMeal")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<NonNullGraphType<StringGraphType>>("name")
                .ResolveAsync(async context =>
                {
                    var mealId = context.GetArgument<int>("mealId");
                    var userId = context.GetArgument<int>("userId");
                    var name = context.GetArgument<string>("name");
                    return await mealService.UpdateMealAsync(mealId, userId, name);
                });

            Field<BooleanGraphType>("deleteMeal")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var mealId = context.GetArgument<int>("mealId");
                    var userId = context.GetArgument<int>("userId");
                    return await mealService.DeleteMealAsync(mealId, userId);
                });

            Field<BooleanGraphType>("deleteAllMealsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await mealService.DeleteAllMealsByUserAsync(userId);
                });


            Field<BooleanGraphType>("addDishToMeal")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<DecimalGraphType>>("quantity")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var mealId = context.GetArgument<int>("mealId");
                    var dishId = context.GetArgument<int>("dishId");
                    var quantity = context.GetArgument<decimal>("quantity");
                    return await mealService.AddDishToMealAsync(userId, mealId, dishId, quantity);
                });

            Field<BooleanGraphType>("updateDishQuantityInMeal")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .Argument<NonNullGraphType<DecimalGraphType>>("quantity")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var mealId = context.GetArgument<int>("mealId");
                    var dishId = context.GetArgument<int>("dishId");
                    var quantity = context.GetArgument<decimal>("quantity");
                    return await mealService.UpdateDishQuantityInMealAsync(userId, mealId, dishId, quantity);
                });

            Field<BooleanGraphType>("removeDishFromMeal")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<NonNullGraphType<IntGraphType>>("mealId")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var mealId = context.GetArgument<int>("mealId");
                    var dishId = context.GetArgument<int>("dishId");
                    return await mealService.RemoveDishFromMealAsync(userId, mealId, dishId);
                });
        }
    }
}
