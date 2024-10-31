using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Configuration.AddJsonFile("appsettings.Local.json", optional: false, reloadOnChange: true);

builder.Services.AddServices(configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    
    var dbContext = serviceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();

    serviceProvider.ConfigureDefaultDb();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "UniverHackathon API V1");
    });
}

app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    if (context.Request.Headers.ContainsKey("Authorization"))
    {
        var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var jwtHandler = new JwtSecurityTokenHandler();

        if (jwtHandler.CanReadToken(token))
        {
            var jwtToken = jwtHandler.ReadJwtToken(token);
            var expiration = jwtToken.ValidTo;

            if (DateTime.UtcNow > expiration)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Token expired.");
                return;
            }
        }
    }
    await next();
});

app.MapControllers();

app.Run();