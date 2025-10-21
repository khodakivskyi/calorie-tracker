using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class NutrientsMutation : ObjectGraphType
    {
        public NutrientsMutation(NutrientsService nutrientsService)
        {
            Field<NonNullGraphType<NutrientsType>>("createNutrients")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<DecimalGraphType>>("protein")
                .Argument<NonNullGraphType<DecimalGraphType>>("fat")
                .Argument<NonNullGraphType<DecimalGraphType>>("carbohydrates")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    var protein = context.GetArgument<decimal>("protein");
                    var fat = context.GetArgument<decimal>("fat");
                    var carbs = context.GetArgument<decimal>("carbohydrates");

                    return await nutrientsService.CreateNutrientsAsync(foodId, protein, fat, carbs);
                });

            Field<NonNullGraphType<NutrientsType>>("updateNutrients")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .Argument<NonNullGraphType<DecimalGraphType>>("protein")
                .Argument<NonNullGraphType<DecimalGraphType>>("fat")
                .Argument<NonNullGraphType<DecimalGraphType>>("carbohydrates")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    var protein = context.GetArgument<decimal>("protein");
                    var fat = context.GetArgument<decimal>("fat");
                    var carbs = context.GetArgument<decimal>("carbohydrates");

                    return await nutrientsService.UpdateNutrientsAsync(foodId, protein, fat, carbs);
                });

            Field<NonNullGraphType<BooleanGraphType>>("deleteNutrients")
                .Argument<NonNullGraphType<IntGraphType>>("foodId")
                .ResolveAsync(async context =>
                {
                    var foodId = context.GetArgument<int>("foodId");
                    return await nutrientsService.DeleteNutrientsAsync(foodId);
                });
        }
    }
}
