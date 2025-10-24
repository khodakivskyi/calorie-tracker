using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class CaloriesDataType : ObjectGraphType
    {
        public CaloriesDataType()
        {
            Name = "CaloriesData";
            Field<DateGraphType>("date");
            Field<DecimalGraphType>("totalCalories");
        }
    }
}

