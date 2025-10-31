using backend.GraphQL;
using backend.GraphQL.Mutations;
using backend.GraphQL.Queries;
using backend.GraphQL.Types;
using backend.Models;
using backend.Repositories;
using backend.Repositories.Interfaces;
using backend.Services;
using DotNetEnv;
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
            Env.Load();
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

            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<FoodService>();
            builder.Services.AddScoped<DishService>();
            builder.Services.AddScoped<MealService>();
            builder.Services.AddScoped<NutrientsService>();
            builder.Services.AddScoped<CaloriesService>();
            builder.Services.AddScoped<ImageService>();

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

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy => policy
                        .WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });

            builder.Services.Configure<AuthMessageSenderOptions>(options =>
            {
                options.SmtpHost = Environment.GetEnvironmentVariable("SMTP_HOST")
                    ?? throw new InvalidOperationException("SMTP_HOST is not set");
                options.SmtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT")
                    ?? throw new InvalidOperationException("SMTP_PORT is not set"));
                options.SmtpUsername = Environment.GetEnvironmentVariable("SMTP_USERNAME")
                    ?? throw new InvalidOperationException("SMTP_USERNAME is not set");
                options.SmtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD")
                    ?? throw new InvalidOperationException("SMTP_PASSWORD is not set");
                options.FromEmail = Environment.GetEnvironmentVariable("FROM_EMAIL")
                    ?? throw new InvalidOperationException("FROM_EMAIL is not set");
                options.FromName = Environment.GetEnvironmentVariable("FROM_NAME")
                    ?? throw new InvalidOperationException("FROM_NAME is not set");
                options.EnableSsl = Environment.GetEnvironmentVariable("ENABLE_SSL") == "true";
            });

            builder.Services.AddTransient<Services.Interfaces.IEmailSender, EmailSender>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseGraphQLGraphiQL("/ui/graphiql");
            }

            app.UseCors("AllowAll");
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseGraphQL<ISchema>("/graphql");

            app.MapControllers();

            app.Run();
        }
    }
}