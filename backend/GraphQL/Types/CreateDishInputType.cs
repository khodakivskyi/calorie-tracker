using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class CreateDishInputType : InputObjectGraphType
    {
        public CreateDishInputType()
        {
            Name = "CreateDishInput";
            Field<NonNullGraphType<IntGraphType>>("dishId");
            Field<NonNullGraphType<DecimalGraphType>>("weight");
        }
    }
}

