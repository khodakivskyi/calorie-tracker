using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation(UserMutation userMutation)
        {
            Name = "Mutation";

            foreach (var field in userMutation.Fields)
                AddField(field);
        }
    }
}
