using backend.Exceptions;
using backend.GraphQL.Mutations;
using backend.GraphQL.Queries;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL
{
    public class AppSchema : Schema
    {
        public AppSchema(IServiceProvider provider, ILogger<AppSchema> logger) : base(provider)
        {
            Query = provider.GetRequiredService<RootQuery>();
            Mutation = provider.GetRequiredService<RootMutation>();

            FieldMiddleware.Use(next => async context =>
            {
                try
                {
                    return await next(context);
                }
                catch (Exception ex)
                {
                    if (ex is not UnauthorizedException &&
                        ex is not ForbiddenException &&
                        ex is not ConflictException &&
                        ex is not NotFoundException &&
                        ex is not ValidationException)
                    {
                        logger.LogError(ex, "Unhandled exception in GraphQL field {Field}", context.FieldDefinition?.Name);
                    }

                    throw ex switch
                    {
                        UnauthorizedException => new ExecutionError("Authentication required", ex),
                        ForbiddenException => new ExecutionError("Access denied", ex),
                        ConflictException => new ExecutionError("Unable to complete operation", ex),
                        NotFoundException => new ExecutionError("Resource not found", ex),
                        ValidationException => new ExecutionError(ex.Message, ex),
                        _ => new ExecutionError("Internal server error", ex)
                    };
                }
            });
        }
    }
}
