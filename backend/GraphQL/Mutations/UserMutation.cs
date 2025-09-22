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
                    try
                    {
                        var email = context.GetArgument<string>("email");
                        var password = context.GetArgument<string>("password");
                        var name = context.GetArgument<string?>("name");

                        return await userService.CreateUserAsync(email, password, name);
                    }
                    catch (ArgumentException ex)
                    {
                        context.Errors.Add(new ExecutionError($"Validation error: {ex.Message}"));
                        return null;
                    }
                    catch
                    {
                        throw;
                    }
                });

            Field<UserType>("updateUser")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .Argument<StringGraphType>("email")
                .Argument<StringGraphType>("password")
                .Argument<StringGraphType>("name")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var id = context.GetArgument<int>("id");
                        var email = context.GetArgument<string?>("email");
                        var password = context.GetArgument<string?>("password");
                        var name = context.GetArgument<string?>("name");

                        var user = await userService.GetUserByIdAsync(id);
                        if (user == null)
                        {
                            context.Errors.Add(new ExecutionError($"User with id {id} not found"));
                            return null;
                        }

                        if (!string.IsNullOrEmpty(email) && email != user.Email)
                        {
                            var existingUser = await userService.GetUserByEmailAsync(email);
                            if (existingUser != null)
                            {
                                context.Errors.Add(new ExecutionError($"User with email '{email}' already exists"));
                                return null;
                            }
                            user.Email = email;
                        }

                        if (!string.IsNullOrEmpty(name))
                            user.Name = name;

                        string oldPasswordHash = user.PasswordHash;

                        var updatedUser = await userService.UpdateUserAsync(user, password);

                        if (!string.IsNullOrEmpty(password) && updatedUser!.PasswordHash == oldPasswordHash)
                        {
                            context.Errors.Add(new ExecutionError($"Password changed error"));
                            return null;
                        }

                        return updatedUser;

                    }
                    catch (ArgumentException ex)
                    {
                        context.Errors.Add(new ExecutionError($"Validation error: {ex.Message}"));
                        return null;
                    }
                    catch
                    {
                        throw;
                    }
                });

            Field<BooleanGraphType>("deleteUser")
                .Argument<NonNullGraphType<IntGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    try
                    {
                        var id = context.GetArgument<int>("id");

                        return await userService.DeleteUserAsync(id);
                    }
                    catch (ArgumentException ex)
                    {
                        context.Errors.Add(new ExecutionError($"Validation error: {ex.Message}"));
                        return false;
                    }
                    catch
                    {
                        throw;
                    }
                });
        }
    }
}
