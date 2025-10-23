using backend.GraphQL.Types;
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
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await dishService.GetDishesByUserAsync(userId);
                });

            Field<ListGraphType<DishType>>("getPrivateDishesByUser")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await dishService.GetPrivateDishesByUserAsync(userId);
                });

            Field<ListGraphType<DishType>>("getGlobalDishes")
                .ResolveAsync(async context =>
                {
                    return await dishService.GetGlobalDishesAsync();
                });

            Field<DishType>("getDishByExternalId")
                .Argument<NonNullGraphType<StringGraphType>>("externalId")
                .ResolveAsync(async context =>
                {
                    var externalId = context.GetArgument<string>("externalId");
                    return await dishService.GetDishByExternalIdAsync(externalId);
                });

            Field<ListGraphType<ObjectGraphType>>("getFoodsByDish")
                .Argument<NonNullGraphType<IntGraphType>>("dishId")
                .ResolveAsync(async context =>
                {
                    var dishId = context.GetArgument<int>("dishId");
                    var userId = 0; //we will get userId from jwt soon
                    var foods = await dishService.GetAllFoodsByDishAsync(userId, dishId);
                    return foods.Select(f => new { f.food.Id, f.food.Name, f.quantity });
                });
        }
    }
}
