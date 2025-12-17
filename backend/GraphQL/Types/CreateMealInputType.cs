using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class CreateMealInputType : InputObjectGraphType
    {
        public CreateMealInputType()
        {
            Name = "CreateMealInput";
            Field<NonNullGraphType<IntGraphType>>("ownerId");
            Field<NonNullGraphType<IntGraphType>>("typeId");
            Field<StringGraphType>("name");
            Field<ListGraphType<MealDishInputType>>("dishes");
        }
    }
}

