using backend.Models;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class CaloriesType : ObjectGraphType<CaloriesModel>
    {
        public CaloriesType()
        {
            Field(x => x.FoodId);
            Field(x => x.Calories);
        }
    }
}
