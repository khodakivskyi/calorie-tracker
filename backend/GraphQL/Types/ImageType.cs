using backend.Models;
using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class ImageType : ObjectGraphType<Image>
    {
        public ImageType()
        {
            Field(x => x.Id);
            Field(x => x.FileName);
            Field(x => x.Url);
            Field(x => x.CreatedAt);
        }
    }
}
