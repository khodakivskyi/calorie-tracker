using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation(UserMutation userMutation, FoodMutation foodMutation)
        {
            Name = "Mutation";

            foreach (var field in userMutation.Fields)
                AddField(field);
            foreach (var field in foodMutation.Fields)
                AddField(field);
        }
    }
}
