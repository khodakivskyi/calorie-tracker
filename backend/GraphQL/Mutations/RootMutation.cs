using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation(UserMutation userMutation, FoodMutation foodMutation, DishMutation dishMutation, MealMutation mealMutation, CalorieLimitMutation calorieLimitMutation)
        {
            Name = "Mutation";

            var mutations = new ObjectGraphType[] { userMutation, foodMutation, dishMutation, mealMutation, calorieLimitMutation };

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
