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
            Field<NonNullGraphType<UserType>>("getUserById")
            .Argument<IntGraphType>("id")
            .ResolveAsync(async context =>
            {
                var id = context.GetArgument<int>("id");
                return await userService.GetUserByIdAsync(id);
            });

            Field<NonNullGraphType<UserType>>("getUserByEmail")
            .Argument<StringGraphType>("email")
            .ResolveAsync(async context =>
            {
                var email = context.GetArgument<string>("email");
                return await userService.GetUserByEmailAsync(email);
            });

            Field<NonNullGraphType<UserType>>("authenticateUser")
                .Argument<NonNullGraphType<StringGraphType>>("email")
                .Argument<NonNullGraphType<StringGraphType>>("password")
                .ResolveAsync(async context =>
                {
                    var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");
                    return await userService.AuthenticateUserAsync(email, password);
                });
        }
    }
}