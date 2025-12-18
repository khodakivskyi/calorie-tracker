using backend.GraphQL.Types;
using backend.Models;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class DishQuery : ObjectGraphType
    {
        public DishQuery(DishService dishService)
        {
            Field<DishType>("getDishById")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var userId = 0; //we will get userId from jwt soon
                    return await dishService.GetDishByIdAsync(id, userId);
                });

            Field<ListGraphType<DishType>>("getDishesByUser")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await dishService.GetDishesByUserAsync(ownerId);
                });

            Field<ListGraphType<DishType>>("getPrivateDishesByUser")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await dishService.GetPrivateDishesByUserAsync(ownerId);
                });

            Field<ListGraphType<DishType>>("getGlobalDishes")
                .ResolveAsync(async context =>
                {
                    return await dishService.GetGlobalDishesAsync();
                });

            Field<ListGraphType<DishFoodType>>("getFoodsByDish")
    .Argument<NonNullGraphType<IntGraphType>>("ownerId")
    .Argument<NonNullGraphType<IntGraphType>>("dishId")
    .ResolveAsync(async context =>
    {
        var dishId = context.GetArgument<int>("dishId");
        var userId = context.GetArgument<int>("ownerId");

        var foods = await dishService.GetAllFoodsByDishAsync(userId, dishId);

        // Приводимо до типу DishFood
        return foods.Select(f =>
        {
            var factor = f.weight / 100m;
            return new
            {
                id = f.food.Id,
                name = f.food.Name,
                weight = f.weight,
                calories = f.food.Calories * factor,
                protein = f.food.Protein * factor,
                fat = f.food.Fat * factor,
                carbohydrate = f.food.Carbohydrate * factor
            };
        });


    });


        }
    }
}
