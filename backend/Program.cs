using backend.GraphQL;
using backend.GraphQL.Mutations;
using backend.GraphQL.Queries;
using backend.GraphQL.Types;
using backend.Models;
using backend.Repositories;
using backend.Repositories.Interfaces;
using backend.Services;
using backend.Services.External;
using GraphQL;
using GraphQL.Execution;
using GraphQL.Types;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Logging.AddConsole();

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddScoped<IUserRepository, UserRepository>(provider => new UserRepository(connectionString!));
            builder.Services.AddScoped<IFoodRepository, FoodRepository>(provider => new FoodRepository(connectionString!));
            builder.Services.AddScoped<IDishRepository, DishRepository>(provider => new DishRepository(connectionString!));
            builder.Services.AddScoped<IMealRepository, MealRepository>(provider => new MealRepository(connectionString!));
            builder.Services.AddScoped<ICaloriesRepository, CaloriesRepository>(provider => new CaloriesRepository(connectionString!));
            builder.Services.AddScoped<INutrientsRepository, NutrientsRepository>(provider => new NutrientsRepository(connectionString!));

            builder.Services.Configure<ImageSettings>(builder.Configuration.GetSection("ImageSettings"));
            builder.Services.AddScoped<IImageRepository, ImageRepository>(provider => new ImageRepository(connectionString!));


            builder.Services.Configure<ImageSettings>(builder.Configuration.GetSection("ImageSettings"));

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


            builder.Services.AddHttpClient(); 

            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<FoodService>();
            builder.Services.AddScoped<DishService>();
            builder.Services.AddScoped<MealService>();
            builder.Services.AddScoped<NutrientsService>();
            builder.Services.AddScoped<CaloriesService>();
            builder.Services.AddScoped<ImageService>();
            builder.Services.AddScoped<FatSecretService>();


            builder.Services.AddSingleton<IErrorInfoProvider, MyErrorInfoProvider>();
            builder.Services.AddScoped<UserType>();
            builder.Services.AddScoped<FoodType>();
            builder.Services.AddScoped<DishType>();
            builder.Services.AddScoped<MealType>();
            builder.Services.AddScoped<NutrientsType>();
            builder.Services.AddScoped<CaloriesType>();
            builder.Services.AddScoped<DishFoodType>();
            builder.Services.AddScoped<MealDishType>();
            builder.Services.AddScoped<CaloriesDataType>();
            builder.Services.AddScoped<AuthPayloadType>();
            builder.Services.AddScoped<ImageType>();

            builder.Services.AddScoped<RootQuery>();
            builder.Services.AddScoped<RootMutation>();
            builder.Services.AddScoped<ISchema, AppSchema>();
            builder.Services.AddGraphQL(options =>
            {
                options.AddSystemTextJson();
                options.AddErrorInfoProvider(opt =>
                {
                    opt.ExposeExceptionDetails = false;
                });
                options.AddGraphTypes(typeof(RootQuery).Assembly);
            });

            var jwtKey = builder.Configuration["JwtSettings:SecretKey"];
            var expiryMinutes = builder.Configuration.GetValue<int>("JwtSettings:ExpiryMinutes", 15);
            builder.Services.AddSingleton(new JwtService(jwtKey!, expiryMinutes));

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey!))
                };
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseGraphQLGraphiQL("/ui/graphiql");
            }

            app.UseCors();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseGraphQL<ISchema>("/graphql");

            app.MapControllers();
            
            app.Run();
        }
    }
}