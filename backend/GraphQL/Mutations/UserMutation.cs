using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class UserMutation : ObjectGraphType
    {
        public UserMutation(UserService userService, JwtService jwtService)
        {
            Name = "UserMutations";

            Field <NonNullGraphType<AuthPayloadType>>("createUser")
                .Argument<NonNullGraphType<StringGraphType>>("email")
                .Argument<NonNullGraphType<StringGraphType>>("password")
                .Argument<StringGraphType>("name")
                .ResolveAsync(async context =>
                {
                    var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");
                    var name = context.GetArgument<string?>("name");
                    var user = await userService.CreateUserAsync(email, password, name);

                    var token = jwtService.GenerateToken(user.Email, "USER");
                    return new
                    {
                        user,
                        token
                    };
                });

            Field<NonNullGraphType<UserType>>("updateUser")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<StringGraphType>("email")
                .Argument<StringGraphType>("password")
                .Argument<StringGraphType>("name")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var email = context.GetArgument<string?>("email");
                    var password = context.GetArgument<string?>("password");
                    var name = context.GetArgument<string?>("name");


                    return await userService.UpdateUserAsync(id, email, password, name);
                });

            Field<BooleanGraphType>("deleteUser")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await userService.DeleteUserAsync(id);
                });
        }
    }
}
