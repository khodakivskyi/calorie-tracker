using Microsoft.AspNetCore.Http;
using GraphQL;

public static class AuthorizationHelper
{
    public static void EnsureAuthenticated(HttpContext? context)
    {
        if (context?.User?.Identity?.IsAuthenticated != true)
            throw new ExecutionError("Unauthorized");
    }

    public static void EnsureRole(HttpContext? context, string role)
    {
        EnsureAuthenticated(context);
        if (!context!.User.IsInRole(role))
            throw new ExecutionError("Forbidden");
    }
}
