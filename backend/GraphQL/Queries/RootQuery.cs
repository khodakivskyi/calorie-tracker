using backend.GraphQL.Mutations;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery(UserQuery userQuery, FoodQuery foodQuery)
        {
            Name = "Query";

            foreach (var field in userQuery.Fields)
                AddField(field);
            foreach (var field in foodQuery.Fields)
                AddField(field);
        }
    }
}
