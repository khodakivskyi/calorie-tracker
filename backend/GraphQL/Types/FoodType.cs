using backend.Models;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class FoodType : ObjectGraphType<Food>
    {
        public FoodType()
        {
            Field(x => x.Id);
            Field(x => x.OwnerId);
            Field(x => x.Name);
            Field(x => x.ImageId, nullable: true);
            Field(x => x.CreatedAt);
            Field(x => x.Source);
            Field(x => x.ExternalId, nullable: true);
        }
    }
}
