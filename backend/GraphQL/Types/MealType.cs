using backend.Models;
using backend.Services;
using GraphQL.Types;


namespace backend.GraphQL.Types;

public class MealType : ObjectGraphType<Meal>
{
    public MealType(CaloriesService caloriesService, NutrientsService nutrientsService)
    {
        Field(x => x.Id);
        Field(x => x.OwnerId);
        Field(x => x.Name);
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt);

        Field<DecimalGraphType, decimal>("calories")
            .ResolveAsync(async context =>
            {
                var meal = context.Source;
                return await caloriesService.GetOrCalculateCaloriesForMealAsync(meal.Id);
            });

        Field<NutrientsType, Nutrients?>("nutrients")
            .ResolveAsync(async context =>
            {
                var meal = context.Source;
                return await nutrientsService.GetNutrientsByMealAsync(meal.Id);
            });
    }
}
