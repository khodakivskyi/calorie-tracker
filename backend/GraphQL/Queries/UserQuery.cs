using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;
using Microsoft.Extensions.Logging;

namespace backend.GraphQL.Queries
{
    public class UserQuery : ObjectGraphType
    {
		private readonly ILogger<UserQuery> _logger; 

        public UserQuery(UserService userService, ILogger<UserQuery> logger)
        {
_logger=logger;

            Field<UserType>("getUserById")
            .Argument<IntGraphType>("id")
            .ResolveAsync(async context =>
            {
                try
                {
 var id = context.GetArgument<int>("id");
                return await userService.GetUserByIdAsync(id);
                }
                catch (ArgumentException ex)
                {
                    context.Errors.Add(new ExecutionError($"Validation error: {ex.Message}"));
                    return null;
                }
                catch (Exception ex)
                {
                    throw;
                }
               
            });

            Field<UserType>("getUserByEmail")
           .Argument<StringGraphType>("email")
           .ResolveAsync(async context =>
           {
               try
               {
  var email = context.GetArgument<string>("email");
               return await userService.GetUserByEmailAsync(email);
               }
               catch (ArgumentException ex)
               {
                   context.Errors.Add(new ExecutionError($"Validation error: {ex.Message}"));
                   return null;
               }
               catch (Exception ex)
               {
                   throw;
               }
           });

            Field<UserType>("authenticateUser")
                .Argument<NonNullGraphType<StringGraphType>>("email")
                .Argument<NonNullGraphType<StringGraphType>>("password")
                .ResolveAsync(async context =>
                {
                    try
                    {
var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");
                    return await userService.AuthenticateUserAsync(email, password);
                    }
                    catch (ArgumentException ex)
                    {
                        context.Errors.Add(new ExecutionError($"Validation error: {ex.Message}"));
                        return null;
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                });
        }
    }

}
