using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation(UserMutation userMutation, MealMutation mealMutation)
        {
            Name = "Mutation";

            foreach (var field in userMutation.Fields)
                AddField(field);

            foreach (var field in mealMutation.Fields)
                AddField(field);
        }
    }
}
