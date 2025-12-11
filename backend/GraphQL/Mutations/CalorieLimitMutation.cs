using backend.GraphQL.Types;
using backend.Services;
using backend.Services.Interfaces;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class CalorieLimitMutation : ObjectGraphType
    {
        public CalorieLimitMutation(CalorieLimitService limitService)
        {
            Name = "CalorieLimitMutations";

            Field<CalorieLimitType>("setCalorieLimit")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<NonNullGraphType<DecimalGraphType>>("limitValue")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var value = context.GetArgument<decimal>("limitValue");

                    return await limitService.SetLimitAsync(userId, value);
                });

            Field<BooleanGraphType>("removeCalorieLimit")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await limitService.DeleteLimitAsync(userId);
                });
        }
    }
}
