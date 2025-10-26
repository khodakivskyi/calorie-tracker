using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation(UserMutation userMutation, FoodMutation foodMutation, DishMutation dishMutation, MealMutation mealMutation)
        {
            Name = "Mutation";

            var mutations = new ObjectGraphType[] { userMutation, foodMutation, dishMutation, mealMutation };

            foreach (var mutation in mutations)
            {
                foreach (var field in mutation.Fields)
                {
                    AddField(field);
                }
            }
        }
    }
}
