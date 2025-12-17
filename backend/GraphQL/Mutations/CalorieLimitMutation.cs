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
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .Argument<NonNullGraphType<DecimalGraphType>>("limitValue")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    var value = context.GetArgument<decimal>("limitValue");

                    return await limitService.SetLimitAsync(ownerId, value);
                });

            Field<BooleanGraphType>("removeCalorieLimit")
                .Argument<NonNullGraphType<IntGraphType>>("ownerId")
                .ResolveAsync(async context =>
                {
                    var ownerId = context.GetArgument<int>("ownerId");
                    return await limitService.DeleteLimitAsync(ownerId);
                });
        }
    }
}
