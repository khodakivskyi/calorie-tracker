using backend.Models;
using backend.Repositories.Interfaces;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class DishType : ObjectGraphType<Dish>
    {
        public DishType(ICaloriesRepository caloriesRepository, INutrientsRepository nutrientsRepository)
        {
            Field(x => x.Id);
            Field(x => x.OwnerId, nullable: true);
            Field(x => x.Name);
            Field(x => x.Weight);
            Field(x => x.ImageId, nullable: true);
            Field(x => x.CreatedAt);
            Field(x => x.UpdatedAt);
            Field(x => x.ExternalId, nullable: true);

            Field<CaloriesType>("calories")
                    .ResolveAsync(async context =>
                    {
                        var dish = context.Source;
                        return await caloriesRepository.GetCaloriesByDishIdAsync(dish.Id);
                    });

            Field<NutrientsType>("nutrients")
                .ResolveAsync(async context =>
                {
                    var dish = context.Source;
                    return await nutrientsRepository.GetNutrientsByDishIdAsync(dish.Id);
                });
        }
    }
}
