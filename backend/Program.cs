using backend.Repositories;
using backend.Repositories.Interfaces;
using backend.Services;
using backend.GraphQL;
using backend.GraphQL.Mutations;
using backend.GraphQL.Queries;
using backend.GraphQL.Types;
using GraphQL;
using GraphQL.Types;
using backend.Models;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddScoped<UserRepository>(provider => new UserRepository(connectionString!));
            builder.Services.AddScoped<IMealRepository>(provider => new MealRepository(connectionString!));

            builder.Services.AddControllers();

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddScoped<UserType>();
            builder.Services.AddScoped<UserService>();

            builder.Services.AddScoped<MealService>();
            builder.Services.AddScoped<MealType>();


            builder.Services.AddScoped<RootQuery>();
            builder.Services.AddScoped<RootMutation>();

            builder.Services.AddScoped<ISchema, AppSchema>();

            builder.Services.AddGraphQL(options =>
            {
                options.AddSystemTextJson();
                options.AddErrorInfoProvider(opt => opt.ExposeExceptionDetails = true);
                options.AddGraphTypes(typeof(RootQuery).Assembly);
            });


            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseGraphQLGraphiQL("/ui/graphiql");
            }

            app.UseCors();
            app.UseAuthorization();
            app.UseGraphQL<ISchema>("/graphql");

            app.MapControllers();

            app.Run();
        }
    }
}