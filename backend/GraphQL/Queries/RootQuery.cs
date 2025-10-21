using backend.GraphQL.Queries;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery(UserQuery userQuery, FoodQuery foodQuery, MealQuery mealQuery, NutrientsQuery nutrientsQuery, CaloriesQuery caloriesQuery)
        {
            Name = "Query";

            var queries = new ObjectGraphType[] { userQuery, foodQuery, mealQuery, nutrientsQuery, caloriesQuery };

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
