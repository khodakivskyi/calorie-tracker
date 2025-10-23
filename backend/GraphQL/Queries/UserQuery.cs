using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class UserQuery : ObjectGraphType
    {
        public UserQuery(UserService userService, JwtService jwtService)
        {
            Field<NonNullGraphType<UserType>>("getUserById")
            .Argument<NonNullGraphType<IntGraphType>>("userId")
            .ResolveAsync(async context =>
            {
                var userId = context.GetArgument<int>("userId");
                return await userService.GetUserByIdAsync(userId);
            });

            Field<NonNullGraphType<AuthPayloadType>>("authenticateUser")
                .Argument<NonNullGraphType<StringGraphType>>("email")
                .Argument<NonNullGraphType<StringGraphType>>("password")
                .ResolveAsync(async context =>
                {
                    var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");

                    var user = await userService.AuthenticateUserAsync(email, password);
                    var token = jwtService.GenerateToken(user.Id, user.Email);

                    return new
                    {
                        user,
                        token
                    };
                });
        }
    }
}