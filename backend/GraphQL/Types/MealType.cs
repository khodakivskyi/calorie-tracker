using backend.Models;
using GraphQL.Types;


namespace backend.GraphQL.Types;

public class MealType : ObjectGraphType<Meal>
{
    public MealType()
    {
        Field(x => x.Id);
        Field(x => x.OwnerId);
        Field(x => x.Name);
        Field(x => x.CreatedAt);
        Field(x => x.UpdatedAt);
    }
}
