using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation(UserMutation userMutation, FoodMutation foodMutation, MealMutation mealMutation, CaloriesMutation caloriesMutation)
        {
            Name = "Mutation";

            var mutations = new ObjectGraphType[] { userMutation, foodMutation, mealMutation, caloriesMutation };

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
