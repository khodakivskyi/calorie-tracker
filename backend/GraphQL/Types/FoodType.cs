using backend.Models;
using backend.Services;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class FoodType : ObjectGraphType<Food>
    {
        public FoodType(CaloriesService caloriesService, NutrientsService nutrientsService)
        {
            Field(x => x.Id);
            Field(x => x.OwnerId, nullable: true);
            Field(x => x.Name);
            Field(x => x.ImageId, nullable: true);
            Field(x => x.CreatedAt);
            Field(x => x.UpdatedAt);
            Field(x => x.ExternalId, nullable: true);

            Field<CaloriesType>("calories")
                .ResolveAsync(async context =>
                {
                    var food = context.Source;
                    return await caloriesService.GetOrCalculateCaloriesForFoodAsync(food.Id);
                });

            Field<NutrientsType>("nutrients")
                .ResolveAsync(async context =>
                {
                    var food = context.Source;
                    return await nutrientsService.GetNutrientsByFoodAsync(food.Id);
                });
        }
    }
}
