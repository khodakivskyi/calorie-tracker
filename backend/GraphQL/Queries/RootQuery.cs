using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery(UserQuery userQuery, MealQuery mealQuery)
        {
            Name = "Query";

            foreach (var field in userQuery.Fields)
                AddField(field);

            foreach (var field in mealQuery.Fields)
                AddField(field);
        }
    }
}
