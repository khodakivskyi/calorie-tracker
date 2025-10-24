using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class MealDishType : ObjectGraphType
    {
        public MealDishType()
        {
            Name = "MealDish";
            Field<IntGraphType>("dishId");
            Field<DecimalGraphType>("quantity");
        }
    }
}

