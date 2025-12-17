using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class CreateDishInputType : InputObjectGraphType
    {
        public CreateDishInputType()
        {
            Name = "CreateDishInput";
            Field<NonNullGraphType<IntGraphType>>("ownerId");
            Field<NonNullGraphType<StringGraphType>>("name");
            Field<NonNullGraphType<DecimalGraphType>>("weight");
            Field<IntGraphType>("imageId");
            Field<ListGraphType<CreateDishFoodInputType>>("foods");
        }
    }
}

