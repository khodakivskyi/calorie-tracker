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
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await limitService.GetLimitByOwnerIdAsync(ownerId);
                });
        }
    }
}
