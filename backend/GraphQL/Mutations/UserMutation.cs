using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Identity;

namespace backend.GraphQL.Mutations
{
    public class UserMutation : ObjectGraphType
    {
        public UserMutation(UserService userService, TokenService tokenService)
        {
            Name = "UserMutations";

            Field <NonNullGraphType<AuthPayloadType>>("createUser")
                .Argument<NonNullGraphType<StringGraphType>>("email")
                .Argument<NonNullGraphType<StringGraphType>>("password")
                .Argument<StringGraphType>("name")
                .ResolveAsync(async context =>
                {
                    var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");
                    var name = context.GetArgument<string?>("name");

                    var user = await userService.CreateUserAsync(email, password, name);

                    return new { user };
                });

            Field<NonNullGraphType<AuthPayloadType>>("updateUser")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .Argument<StringGraphType>("email")
                .Argument<StringGraphType>("password")
                .Argument<StringGraphType>("name")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var email = context.GetArgument<string?>("email");
                    var password = context.GetArgument<string?>("password");
                    var name = context.GetArgument<string?>("name");

                    var user = await userService.UpdateUserAsync(userId, email, password, name);
                    var (accessToken, refreshToken ) = await tokenService.GenerateTokensAsync(user);

                    var httpContext = context.RequestServices?.GetService<IHttpContextAccessor>()?.HttpContext;
                    if (httpContext != null)
                    {
                        httpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.Strict,
                            Expires = DateTimeOffset.UtcNow.AddDays(7),
                            Path = "/graphql"
                        });
                    }

                    return new
                    {
                        user,
                        accessToken
                    };
                });

            Field<BooleanGraphType>("deleteUser")
                .Argument<NonNullGraphType<IntGraphType>>("userId")
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    return await userService.DeleteUserAsync(userId);
                });

            Field<BooleanGraphType>("verifyEmail")
                .Argument<NonNullGraphType<StringGraphType>>("token")
                .ResolveAsync(async context =>
                {
                    var token = context.GetArgument<string>("token");

                    return await userService.VerifyEmailAsync(token);
                });
        }
    }
}
