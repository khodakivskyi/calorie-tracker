using backend.Models;
using GraphQL.Types;


namespace backend.GraphQL.Types;

public class UserType : ObjectGraphType<User>
{
    public UserType()
    {
        Field(x => x.Id);
        Field(x => x.Name);
        Field(x => x.Email);
    }
}
