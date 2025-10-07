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

                    var food = new Food(ownerId, name, imageId, source, externalId);
                    return await foodService.CreateFoodAsync(food);
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

                    var existing = await foodService.GetFoodByIdAsync(id, ownerId);
                    if (existing == null) return null;

                    if (!string.IsNullOrEmpty(name)) existing.Name = name;
                    if (imageId.HasValue) existing.ImageId = imageId;
                    if (source.HasValue) existing.Source = source.Value;
                    if (!string.IsNullOrEmpty(externalId)) existing.ExternalId = externalId;

                    return await foodService.UpdateFoodAsync(existing);
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
