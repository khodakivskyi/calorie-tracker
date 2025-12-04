using backend.Models;
using backend.Services;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class FoodType : ObjectGraphType<Food>
    {
        public FoodType(CaloriesService caloriesService, NutrientsService nutrientsService, ImageService imageService)
        {
            Field(x => x.Id);
            Field(x => x.OwnerId, nullable: true);
            Field(x => x.Name);
            Field(x => x.ImageId, nullable: true);
            Field(x => x.CreatedAt);
            Field(x => x.UpdatedAt);
            Field(x => x.Calories);
            Field(x => x.Proteins);
            Field(x => x.Carbohydrate);
            Field(x => x.Fats);
            Field(x => x.IsExternal, nullable: true);

            /*Field<StringGraphType, string?>("image")
                .ResolveAsync(async context =>
                {
                    var food = context.Source;
                    if (food.ImageId == null)
                        return null;

                    try
                    {
                        var image = await imageService.GetImageByIdAsync(food.ImageId.Value);
                        return image.Url;
                    }
                    catch
                    {
                        return null;
                    }
                });*/
        }
    }
}
