using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery(UserQuery userQuery)
        {
            Name = "Query";

            foreach (var field in userQuery.Fields)
                AddField(field);
        }
    }
}
