using backend.Models;
using backend.Services;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class DishType : ObjectGraphType<Dish>
    {
        public DishType(CaloriesService caloriesService, NutrientsService nutrientsService)
        {
            Field(x => x.Id);
            Field(x => x.OwnerId, nullable: true);
            Field(x => x.Name);
            Field(x => x.Weight);
            Field(x => x.ImageId, nullable: true);
            Field(x => x.CreatedAt);
            Field(x => x.UpdatedAt);
            Field(x => x.ExternalId, nullable: true);

            Field<DecimalGraphType, decimal>("calories")
                .ResolveAsync(async context =>
                {
                    var dish = context.Source;
                    return await caloriesService.GetOrCalculateCaloriesForDishAsync(dish.Id);
                });

            Field<NutrientsType, Nutrients?>("nutrients")
                .ResolveAsync(async context =>
                {
                    var dish = context.Source;
                    return await nutrientsService.GetNutrientsByDishAsync(dish.Id);
                });
        }
    }
}
