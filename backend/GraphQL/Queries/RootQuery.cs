using backend.GraphQL.Queries;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery(UserQuery userQuery, FoodQuery foodQuery, MealQuery mealQuery, CaloriesQuery caloriesQuery)
        {
            Name = "Query";

            var queries = new ObjectGraphType[] { userQuery, foodQuery, mealQuery, caloriesQuery };

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
