using backend.Models;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class NutrientsType : ObjectGraphType<Nutrients>
    {
        public NutrientsType()
        {
            Field(x => x.Protein);
            Field(x => x.Fat);
            Field(x => x.Carbohydrate);
            Field(x => x.FoodId);
        }
    }
}
