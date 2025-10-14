using backend.Exceptions;
using GraphQL;
using GraphQL.Execution;

namespace backend.GraphQL
{
    public class MyErrorInfoProvider : ErrorInfoProvider
    {
        public override ErrorInfo GetInfo(ExecutionError executionError)
        {
            var info = base.GetInfo(executionError);

            var original = executionError.InnerException ?? executionError;

            info.Extensions!["code"] = original switch
            {
                UnauthorizedException => "UNAUTHORIZED",
                ForbiddenException => "FORBIDDEN",
                ConflictException => "CONFLICT",
                NotFoundException => "NOT_FOUND",
                ValidationException => "VALIDATION_ERROR",
                _ => "INTERNAL_ERROR"
            };

            return new ErrorInfo
            {
                Message = info.Message,
                Extensions = info.Extensions
            };
        }
    }
}
