using backend.Repositories;

using backend.GraphQL;
using backend.GraphQL.Mutations;
using backend.GraphQL.Queries;
using backend.GraphQL.Types;
using GraphQL;
using GraphQL.Types;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddScoped<UserRepository>(provider => new UserRepository(connectionString!));

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddSingleton<UserType>();

            builder.Services.AddSingleton<RootQuery>();
            builder.Services.AddSingleton<RootMutation>();

            builder.Services.AddSingleton<ISchema, AppSchema>();

            builder.Services.AddGraphQL(options =>
            {
                options.AddSystemTextJson();
                options.AddErrorInfoProvider(opt => opt.ExposeExceptionDetails = true);
                options.AddGraphTypes(typeof(RootQuery).Assembly);
            });


            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();
            app.UseCors();
            app.UseGraphQL<ISchema>("/graphql");
            app.UseGraphQLGraphiQL("/ui/graphiql");

            app.MapControllers();

            app.Run();
        }
    }
}
