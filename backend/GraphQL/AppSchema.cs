using backend.Exceptions;
using backend.GraphQL.Mutations;
using backend.GraphQL.Queries;
using GraphQL;
using GraphQL.Instrumentation;
using GraphQL.Types;
using Microsoft.Extensions.Logging;

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
                        logger.LogError(ex, $"Unhandled exception in GraphQL field {context.FieldDefinition?.Name}");
                    }

                    throw ex switch
                    {
                        UnauthorizedException unauthorized => new ExecutionError(unauthorized.Message)
                        {
                            Code = "UNAUTHORIZED",
                            Data = { ["exception"] = ex }
                        },
                        ForbiddenException forbidden => new ExecutionError(forbidden.Message)
                        {
                            Code = "FORBIDDEN",
                            Data = { ["exception"] = ex }
                        },
                        ConflictException conflict => new ExecutionError(conflict.Message)
                        {
                            Code = "CONFLICT",
                            Data = { ["exception"] = ex } 
                        },
                        NotFoundException notFound => new ExecutionError(notFound.Message)
                        {
                            Code = "NOT_FOUND",
                            Data = { ["exception"] = ex }
                        },
                        ValidationException validation => new ExecutionError(validation.Message)
                        {
                            Code = "VALIDATION_ERROR",
                            Data = { ["exception"] = ex }
                        },
                        _ => new ExecutionError("Internal server error") { Data = { ["exception"] = ex } }
                    };
                }
            });
        }
    }
}
