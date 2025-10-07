using Microsoft.AspNetCore.Http;
using backend.Exceptions;

public static class AuthorizationHelper
{
    public static void EnsureAuthenticated(HttpContext? context)
    {
        if (context?.User?.Identity?.IsAuthenticated != true)
            throw new UnauthorizedException();
    }

    public static void EnsureRole(HttpContext? context, string role)
    {
        EnsureAuthenticated(context);
        if (!context!.User.IsInRole(role))
            throw new ForbiddenException();
    }
}
