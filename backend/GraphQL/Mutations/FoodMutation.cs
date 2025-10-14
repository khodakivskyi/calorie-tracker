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
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<StringGraphType>>("name")
                .Argument<IntGraphType>("imageId")
                .Argument<NonNullGraphType<IntGraphType>>("source")
                .Argument<StringGraphType>("externalId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var name = context.GetArgument<string>("name");
                    var imageId = context.GetArgument<int?>("imageId");
                    var source = context.GetArgument<int>("source");
                    var externalId = context.GetArgument<string?>("externalId");

                    return await foodService.CreateFoodAsync(ownerId, name, imageId, source, externalId);
                });

            Field<FoodType>("updateFood")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<StringGraphType>("name")
                .Argument<IntGraphType>("imageId")
                .Argument<IntGraphType>("source")
                .Argument<StringGraphType>("externalId")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var ownerId = context.GetArgument<int>("ownerId");
                    var name = context.GetArgument<string?>("name");
                    var imageId = context.GetArgument<int?>("imageId");
                    var source = context.GetArgument<int?>("source");
                    var externalId = context.GetArgument<string?>("externalId");

                    return await foodService.UpdateFoodAsync(id, ownerId, name, imageId, source, externalId);
                });

            Field<BooleanGraphType>("deleteFood")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await foodService.DeleteFoodAsync(id, ownerId);
                });

            Field<BooleanGraphType>("deleteAllFoodsByUser")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await foodService.DeleteAllFoodsByUserAsync(ownerId);
                });
        }
    }
}
