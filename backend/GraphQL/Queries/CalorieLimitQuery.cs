using backend.GraphQL.Types;
using backend.Services;
using backend.Services.Interfaces;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class CalorieLimitQuery : ObjectGraphType
    {
        public CalorieLimitQuery(CalorieLimitService limitService)
        {
            Field<CalorieLimitType>("getCalorieLimit")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await limitService.GetLimitByUserIdAsync(userId);
                });
        }
    }
}
