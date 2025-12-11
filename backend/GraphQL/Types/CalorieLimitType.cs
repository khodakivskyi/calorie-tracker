using backend.Models;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class CalorieLimitType : ObjectGraphType<CalorieLimit>
    {
        public CalorieLimitType()
        {
            Field(x => x.Id);
            Field(x => x.UserId);
            Field(x => x.LimitValue);
            Field(x => x.CreatedAt);
        }
    }
}
