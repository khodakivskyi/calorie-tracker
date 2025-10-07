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
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<StringGraphType>>("name")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var name = context.GetArgument<string>("name");
                    return await mealService.CreateMealAsync(ownerId, name);
                });

            Field<NonNullGraphType<MealType>>("updateMeal")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<NonNullGraphType<StringGraphType>>("name")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var name = context.GetArgument<string>("name");
                    return await mealService.UpdateMealAsync(id, name);
                });

            Field<BooleanGraphType>("deleteMeal")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await mealService.DeleteMealAsync(id);
                });

            Field<BooleanGraphType>("deleteAllMealsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await mealService.DeleteAllMealsByUserAsync(ownerId);
                });
        }
    }
}
