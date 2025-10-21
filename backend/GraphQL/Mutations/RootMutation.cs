using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation(UserMutation userMutation, FoodMutation foodMutation, MealMutation mealMutation, NutrientsMutation nutrientsMutation)
        {
            Name = "Mutation";

            var mutations = new ObjectGraphType[] { userMutation, foodMutation, mealMutation };

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
