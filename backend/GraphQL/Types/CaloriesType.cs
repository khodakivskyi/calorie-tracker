using backend.Models;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class CaloriesType : ObjectGraphType<CaloriesModel>
    {
        public CaloriesType()
        {
            Name = "Calories";
            Field(x => x.Id);
            Field(x => x.FoodId);
            Field(x => x.Calories);
        }
    }
}
