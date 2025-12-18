using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class MealDishInputType : InputObjectGraphType
    {
        public MealDishInputType()
        {
            Name = "MealDishInput";
            Field<NonNullGraphType<IntGraphType>>("dishId");
            Field<NonNullGraphType<DecimalGraphType>>("weight");
        }
    }
}

