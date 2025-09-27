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

            switch (original)
            {
                case ConflictException conflict:
                    info.Message = conflict.Message;
                    info.Extensions!["code"] = "CONFLICT";
                    break;

                case NotFoundException notFound:
                    info.Message = notFound.Message;
                    info.Extensions!["code"] = "NOT_FOUND";
                    break;

                case ValidationException validation:
                    info.Message = validation.Message;
                    info.Extensions!["code"] = "VALIDATION_ERROR";
                    break;
            }

            return info;
        }
    }
}
