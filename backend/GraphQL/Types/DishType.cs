using backend.Models;
using backend.Services;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class DishType : ObjectGraphType<Dish>
    {
        public DishType(CaloriesService caloriesService, NutrientsService nutrientsService, ImageService imageService)
        {
            Field(x => x.Id);
            Field(x => x.OwnerId, nullable: true);
            Field(x => x.Name);
            Field(x => x.Weight);
            Field(x => x.ImageId, nullable: true);
            Field(x => x.CreatedAt);
            Field(x => x.UpdatedAt);
            Field(x => x.Calories);
            Field(x => x.Protein);
            Field(x => x.Carbohydrate);
            Field(x => x.Fat);
            Field(x => x.IsExternal, nullable: true);
        }
    }
}
