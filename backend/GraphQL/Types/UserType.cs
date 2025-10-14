using backend.Models;
using GraphQL.Types;


namespace backend.GraphQL.Types;

public class UserType : ObjectGraphType<User>
{
    public UserType()
    {
        Field(x => x.Id);
        Field(x => x.Name, nullable: true);
        Field(x => x.Email);
    }
}
