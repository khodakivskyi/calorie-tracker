using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class ImageQuery : ObjectGraphType
    {
        public ImageQuery(ImageService imageService)
        {
            Field<ImageType>("getImageById")
                .Argument<NonNullGraphType<IntGraphType>>("imageId")
                .ResolveAsync(async context =>
                {
                    var imageId = context.GetArgument<int>("imageId");
                    return await imageService.GetImageByIdAsync(imageId);
                });

            Field<ListGraphType<ImageType>>("getImagesByUser")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await imageService.GetImagesByUserAsync(userId);
                });
        }
    }
}
