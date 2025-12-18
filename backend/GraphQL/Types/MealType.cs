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
        Field(x => x.TypeId);
        Field(x => x.Name);
        Field(x => x.Calories);
        Field(x => x.Protein);
        Field(x => x.Carbohydrate);
        Field(x => x.Fat);
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt);
    }
}
