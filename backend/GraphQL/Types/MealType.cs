using backend.Models;
using backend.Repositories.Interfaces;
using GraphQL.Types;


namespace backend.GraphQL.Types;

public class MealType : ObjectGraphType<Meal>
{
    public MealType(ICaloriesRepository caloriesRepository, INutrientsRepository nutrientsRepository)
    {
        Field(x => x.Id);
        Field(x => x.OwnerId);
        Field(x => x.Name);
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt);

        Field<CaloriesType>("calories")
            .ResolveAsync(async context =>
            {
                var meal = context.Source;
                return await caloriesRepository.GetCaloriesByMealIdAsync(meal.Id);
            });

        Field<NutrientsType>("nutrients")
            .ResolveAsync(async context =>
            {
                var meal = context.Source;
                return await nutrientsRepository.GetNutrientsByMealIdAsync(meal.Id);
            });
    }
}
