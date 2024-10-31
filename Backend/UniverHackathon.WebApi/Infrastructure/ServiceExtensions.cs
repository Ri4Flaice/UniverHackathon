using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using UniverHackathon.WebApi.Business.Jwt;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Database.Entities;
using UniverHackathon.WebApi.Enums;
using UniverHackathon.WebApi.Models.Jwt;
using UniverHackathon.WebApi.Models.Roles;

namespace UniverHackathon.WebApi.Infrastructure;

public static class ServiceExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "UniverHackathon API", Version = "v1" });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter your JWT token",
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
                }
            });
        });

        services.AddControllers();

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("UniverHackathonDB")
            ?? throw new Exception("Connection string 'UniverHackathonDB' is missing or empty.")));

        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                policyBuilder => policyBuilder.WithOrigins("http://localhost:5173")
                    .AllowCredentials()
                    .AllowAnyHeader()
                    .AllowAnyMethod());
        });

        services.Configure<JwtOptions>(configuration.GetSection("JwtOptions"));
        services.AddScoped<JwtProvider>();

        services.AddIdentity<UserEntity, IdentityRole<Guid>>(options =>
            {
                options.User.RequireUniqueEmail = false;

                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 10;

                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                var jwtOptions = services.BuildServiceProvider().GetRequiredService<IOptions<JwtOptions>>().Value;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var authHeader = context.Request.Headers["Authorization"].ToString();
                        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                        {
                            context.Token = authHeader.Substring("Bearer ".Length).Trim();
                        }
                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            context.Response.Headers.Add("Token-Expired", "true");
                        }
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization(options =>
        {
            options.DefaultPolicy = new AuthorizationPolicyBuilder()
                .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .Build();
        });
        return services;
    }

    public static void ConfigureDefaultDb(this IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<UserEntity>>();

        var existingRoles = roleManager.Roles.Select(t => t.Name).ToListAsync().GetAwaiter().GetResult();
        var rolesList = UserRoles.RolesList;

        foreach (var role in rolesList.Where(l => !existingRoles.Contains(l)))
        {
            roleManager.CreateAsync(new IdentityRole<Guid>(role)).GetAwaiter().GetResult();
        }

        var adminUser = userManager.Users.AnyAsync(u => u.AccountType == AccountType.Admin).GetAwaiter().GetResult();

        if (adminUser) return;
        
        var user = new UserEntity
        {
            AccountType = AccountType.Admin,
            PhoneNumber = "+77071234567",
            UserName = "+77071234567",
            FullName = "Admin"
        };

        var result = userManager.CreateAsync(user, "Admin@12345")
            .GetAwaiter().GetResult();

        if (!result.Succeeded) return;
            
        var createdUser = userManager.FindByNameAsync(user.UserName!).GetAwaiter().GetResult();

        userManager.RemoveFromRolesAsync(createdUser!, rolesList).GetAwaiter().GetResult();
        userManager.AddToRoleAsync(createdUser!, UserRoles.Admin).GetAwaiter().GetResult();
    }
}