using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class NutrientsQuery : ObjectGraphType
    {
        public NutrientsQuery(NutrientsService nutrientsService)
        {
            Field<NonNullGraphType<NutrientsType>>("getNutrientsByFood")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    return await nutrientsService.GetNutrientsByFoodAsync(foodId);
                });
        }
    }
}
