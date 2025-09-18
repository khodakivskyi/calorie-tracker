using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class UserQuery : ObjectGraphType
    {
        public UserQuery(UserService userService)
        {
            Field<UserType>("getUserById")
            .Argument<IntGraphType>("id")
            .ResolveAsync(async context =>
            {
                var id = context.GetArgument<int>("id");
                return await userService.GetUserByIdAsync(id);
            });

            Field<UserType>("getUserByEmail")
           .Argument<StringGraphType>("email")
           .ResolveAsync(async context =>
           {
               var email = context.GetArgument<string>("email");
               return await userService.GetUserByEmailAsync(email);
           });
        }
    }

}
