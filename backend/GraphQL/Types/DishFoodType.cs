using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class DishFoodType : ObjectGraphType
    {
        public DishFoodType()
        {
            Name = "DishFood";
            Field<IntGraphType>("id");
            Field<StringGraphType>("name");
            Field<DecimalGraphType>("weight");
            Field<DecimalGraphType>("calories");
            Field<DecimalGraphType>("protein");
            Field<DecimalGraphType>("fat");
            Field<DecimalGraphType>("carbohydrate");
        }
    }
}

