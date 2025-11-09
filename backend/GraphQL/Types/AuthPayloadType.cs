using GraphQL.Types;

namespace backend.GraphQL.Types
{
    public class AuthPayloadType : ObjectGraphType
    {
        public AuthPayloadType()
        {
            Field<NonNullGraphType<UserType>>("user");
            Field<NonNullGraphType<StringGraphType>>("accessToken");
        }
    }
}