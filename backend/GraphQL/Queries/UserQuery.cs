using backend.Exceptions;
using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Queries
{
    public class UserQuery : ObjectGraphType
    {
        public UserQuery(UserService userService, TokenService tokenService)
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

                    var (accessToken, refreshToken) = await tokenService.GenerateTokensAsync(user);

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

            Field<StringGraphType>("refreshToken")
                .ResolveAsync(async context =>
                {
                    var httpContext = context.RequestServices?.GetService<IHttpContextAccessor>()?.HttpContext;
                    if (httpContext == null)
                        throw new UnauthorizedException("No HTTP context");

                    var refreshToken = httpContext.Request.Cookies["refreshToken"];
                    if (string.IsNullOrEmpty(refreshToken))
                        throw new UnauthorizedException("No refresh token");

                    var authHeader = httpContext.Request.Headers["Authorization"].ToString();
                    var oldAccessToken = authHeader.Replace("Bearer ", "");

                    var (newAccessToken, newRefreshToken) = await tokenService.RefreshTokensAsync(
                        oldAccessToken,
                        refreshToken
                    );

                    if (newAccessToken == null)
                        throw new UnauthorizedException("Invalid refresh token");

                    httpContext.Response.Cookies.Append("refreshToken", newRefreshToken!, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Strict,
                        Expires = DateTimeOffset.UtcNow.AddDays(7),
                        Path = "/graphql"
                    });

                    return newAccessToken;
                });


            Field<BooleanGraphType>("logout")
                .ResolveAsync(context =>
                {
                    var httpContext = context.RequestServices?.GetService<IHttpContextAccessor>()?.HttpContext;
                    if (httpContext != null)
                    {
                        httpContext.Response.Cookies.Delete("refreshToken");
                    }
                    return Task.FromResult<object?>(true);
                });
        }
    }
}