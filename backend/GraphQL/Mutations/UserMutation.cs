using backend.GraphQL.Types;
using backend.Services;
using GraphQL;
using GraphQL.Types;

namespace backend.GraphQL.Mutations
{
    public class UserMutation : ObjectGraphType
    {
        public UserMutation(UserService userService)
        {
            Name = "UserMutations";

            Field<UserType>("createUser")
                .Argument<NonNullGraphType<StringGraphType>>("email")
                .Argument<NonNullGraphType<StringGraphType>>("password")
                .Argument<StringGraphType>("name")
                .ResolveAsync(async context =>
                {
                    var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");
                    var name = context.GetArgument<string?>("name");

                    return await userService.CreateUserAsync(email, password, name);
                });

            Field<BooleanGraphType>("updateUser")
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

                    var user = await userService.GetUserByIdAsync(id);
                    if (user == null) return false;

                    if (!string.IsNullOrEmpty(email))
                        user.Email = email;

                    if (!string.IsNullOrEmpty(name))
                        user.Name = name;

                    return await userService.UpdateUserAsync(user, password);
                });

            Field<BooleanGraphType>("deleteUser")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");
                    return await userService.DeleteUserAsync(id);
                });

            Field<UserType>("authenticateUser")
                .Argument<NonNullGraphType<StringGraphType>>("email")
                .Argument<NonNullGraphType<StringGraphType>>("password")
                .ResolveAsync(async context =>
                {
                    var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");
                    return await userService.AuthenticateUserAsync(email, password);
                });
        }
    }
}
