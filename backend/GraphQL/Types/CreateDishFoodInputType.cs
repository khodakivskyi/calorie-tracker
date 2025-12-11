using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class CreateDishFoodInputType : InputObjectGraphType
    {
        public CreateDishFoodInputType()
        {
            Name = "CreateDishFoodInput";
            Field<NonNullGraphType<IntGraphType>>("foodId");
            Field<NonNullGraphType<DecimalGraphType>>("weight");
        }
    }
}

