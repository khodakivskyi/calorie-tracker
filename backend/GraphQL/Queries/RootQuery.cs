using backend.GraphQL.Queries;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery(UserQuery userQuery, FoodQuery foodQuery, DishQuery dishQuery, MealQuery mealQuery, ImageQuery imageQuery)
        {
            Name = "Query";

            var queries = new ObjectGraphType[] { userQuery, foodQuery, dishQuery, mealQuery, imageQuery };

            foreach (var query in queries)
            {
                foreach (var field in query.Fields)
                {
                    AddField(field);
                }
            }
        }
    }
}
