using FluentValidation;
using HCManagement.Api.Configurations;
using HCManagement.Api.Filters;
using HCManagement.Api.Middlewares;
using HCManagement.Api.Providers;
using HCManagement.Core.Common.Security;
using HCManagement.Core.Common.Services;
using HCManagement.Core.Common.Time;
using HCManagement.Core.Common.Validation;
using HCManagement.Core.Persistence.DbContext;
using HCManagement.Core.Persistence.Handlers;
using HCManagement.Core.Persistence.Seeders;
using HCManagement.Core.Features.Authentication;
using HCManagement.Core.Features.MenuCategories;
using HCManagement.Core.Features.MenuItems;
using HCManagement.Core.Features.Seatings;
using HCManagement.Core.Features.Orders;
using HCManagement.Core.Features.Users;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.OpenApi;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;

namespace HCManagement.Api;

public static class Program
{
    public static async Task Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        // Connection string - EF Core.
        string connectionString = builder.Configuration.GetConnectionString("PostgreSql")!;

        // Add services from core layer.
        string webRootPath = builder.Environment.WebRootPath;
        // DbContextFactory.
        builder.Services.AddDbContextFactory<AppDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        // DbContext.
        builder.Services.AddDbContext<AppDbContext>();

        // DbException handlers.
        builder.Services.AddScoped<IDbExceptionHandler, PostgreSqlDbExceptionHandler>();

        // builder.Services.
        builder.Services.AddScoped<IListFetchingService, ListFetchingService>();
        builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
        builder.Services.AddScoped<IMenuCategoryService, MenuCategoryService>();
        builder.Services.AddScoped<IMenuItemService, MenuItemService>();
        builder.Services.AddScoped<ISeatingService, SeatingService>();
        builder.Services.AddScoped<IOrderService, OrderService>();
        builder.Services.AddScoped<IUserService, UserService>();

        // Seeders.
        builder.Services.AddTransient<Seeder>();
        builder.Services.AddTransient<MenuItemSeeder>();
        builder.Services.AddTransient<SeatingSeeder>();
        builder.Services.AddTransient<UserSeeder>();

        // Security.
        builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

        // Time.
        builder.Services.AddScoped<IClock, Clock>();

        // Fluent validation.
        builder.Services.AddValidatorsFromAssemblyContaining<VerifyCredentialsRequestDto>(includeInternalTypes: true);
        ValidatorOptions.Global.LanguageManager.Enabled = true;
        ValidatorOptions.Global.LanguageManager = new ValidatorLanguageManager
        {
            Culture = new("vi")
        };

        // Add services from api layer.
        builder.Services.AddScoped<CallerDetailProvider>();
        builder.Services.AddScoped<ICallerDetailProvider>(p => p.GetRequiredService<CallerDetailProvider>());

        // Cookie.
        builder.Services
            .AddAuthentication()
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromDays(30);
                options.SlidingExpiration = false;
                options.Cookie.Name = "HCManagementAuthenticationCookie";
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
                    ? CookieSecurePolicy.None
                    : CookieSecurePolicy.Always;
                options.LoginPath = "/SignIn";
                options.LogoutPath = "/Logout";

                options.Events.OnRedirectToLogin = options.Events.OnRedirectToAccessDenied = (context) =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToLogout = (context) =>
                {
                    context.Response.StatusCode = StatusCodes.Status200OK;
                    return Task.CompletedTask;
                };
            });

        builder.Services.AddAuthorization();

        // Add controllers with JSON serialization policy.
        builder.Services
            .AddControllersWithViews(options =>
            {
                // options.Conventions.Add(new RouteTokenTransformerConvention(new PluralParameterTransformer()));
                // options.Conventions.Add(new RouteTokenTransformerConvention(new KebabParameterTransformer()));
                options.Filters.Add<ExceptionFilter>();
            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;

                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(allowIntegerValues: false));
                options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.Strict;
            });

        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.NumberHandling = JsonNumberHandling.Strict;
        });

        // Swagger + OpenAPI.
        builder.Services.AddEndpointsApiExplorer();

        NullabilityInfoContext nullabilityContext = new();
        builder.Services.AddOpenApi(options =>
        {
            options.AddOperationTransformer((operation, context, cancellationToken) =>
            {
                ApiDescription apiDescription = context.Description;
                string? controllerName = apiDescription.ActionDescriptor.RouteValues["controller"];
                string? actionName = apiDescription.ActionDescriptor.RouteValues["action"];

                if (actionName is "List" or "Detail")
                {
                    actionName = $"Get{actionName}";
                }

                operation.OperationId = $"{controllerName}_{actionName}";

                return Task.CompletedTask;
            });

            options.AddSchemaTransformer((schema, context, cancellationToken) =>
            {
                JsonTypeInfo typeInfo = context.JsonTypeInfo;

                if (!typeInfo.Type.Name.EndsWith("ResponseDto"))
                {
                    return Task.CompletedTask;
                }

                if (typeInfo.Type is not { IsClass: true })
                {
                    return Task.CompletedTask;
                }

                foreach (JsonPropertyInfo property in typeInfo.Properties)
                {
                    if (property.AttributeProvider is not PropertyInfo propertyInfo)
                    {
                        continue;
                    }

                    // Every response DTO property must be present.
                    schema.Required ??= new HashSet<string>();
                    schema.Required.Add(property.Name);

                    NullabilityInfo nullability =
                        nullabilityContext.Create(propertyInfo);

                    if (nullability.ReadState == NullabilityState.Nullable)
                    {
                        MakeNullable(schema, property.Name);
                    }
                    else
                    {
                        MakeNonNullable(schema, property.Name);
                    }
                }

                return Task.CompletedTask;
            });
        });

        // Build application.
        WebApplication app = builder.Build();
        app.UseForwardedHeaders(new()
        {
            ForwardedHeaders = ForwardedHeaders.All
        });

        // Configure database and seed data.
        await app.Services.EnsureDatabaseCreatedAsync();
        await app.Services.SeedDataAsync(app.Environment.IsDevelopment());

        app.Use(async (context, next) =>
        {
            if (context.Request.Headers.ContainsKey("Origin"))
            {
                string origin = context.Request.Headers.Origin.ToString();
                context.Response.Headers.AccessControlAllowOrigin = origin;
                context.Response.Headers.AccessControlAllowCredentials = "true";
            }

            await next();
        });

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseHttpsRedirection();
        }

        app.UseMiddleware<RequestLoggingMiddleware>();
        app.UseDeveloperExceptionPage();
        app.UseRouting();
        app.UseResponseCaching();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<CallerDetailExtractingMiddleware>();
        app.MapControllers();
        app.UseStaticFiles();
        app.MapOpenApi();
        app.MapFallback(async context =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = 404;
                return;
            }

            string? acceptHeader = context.Request.Headers.Accept.ToString();
            if (acceptHeader.Contains("text/html"))
            {
                context.Response.ContentType = "text/html";
                await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "index.html"));
                return;
            }

            context.Response.StatusCode = 404;
        });

        await app.RunAsync();
    }

    extension(IServiceProvider serviceProvider)
    {
        public async Task EnsureDatabaseCreatedAsync()
        {

            IServiceScopeFactory serviceScopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
            using IServiceScope serviceScope = serviceScopeFactory.CreateScope();
            AppDbContext context = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>();
            ILogger<AppDbContext> logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

            logger.LogInformation("Ensuring database created");

            await context.Database.OpenConnectionAsync();
            await context.Database.EnsureCreatedAsync();
            await context.Database.CloseConnectionAsync();
        }

        public async Task SeedDataAsync(bool isDevelopment)
        {
            IServiceScopeFactory serviceScopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
            using IServiceScope serviceScope = serviceScopeFactory.CreateScope();
            Seeder seeder = serviceScope.ServiceProvider.GetRequiredService<Seeder>();

            await seeder.SeedAsync(isDevelopment);
        }
    }

    static void MakeNullable(OpenApiSchema schema, string propertyName)
    {
        if (schema.Properties?.TryGetValue(propertyName, out IOpenApiSchema? propertySchema) != true)
        {
            return;
        }

        if (propertySchema is null)
        {
            return;
        }

        schema.Properties[propertyName] = new OpenApiSchema
        {
            AnyOf = new List<IOpenApiSchema>
            {
                propertySchema,
                new OpenApiSchema
                {
                    Type = JsonSchemaType.Null
                }
            }
        };
    }

    static void MakeNonNullable(OpenApiSchema schema, string propertyName)
    {
        if (schema.Properties?.TryGetValue(propertyName, out IOpenApiSchema? propertySchema) != true)
        {
            return;
        }

        if (propertySchema is not OpenApiSchema openApiSchema)
        {
            return;
        }

        if (openApiSchema.Type is null)
        {
            return;
        }

        JsonSchemaType type = openApiSchema.Type.Value;
        if (!type.HasFlag(JsonSchemaType.Null))
        {
            return;
        }

        type &= ~JsonSchemaType.Null;

        if (type == 0)
        {
            return;
        }

        openApiSchema.Type = type;
    }
}
