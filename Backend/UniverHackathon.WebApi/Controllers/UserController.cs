using Microsoft.AspNetCore.Mvc;
using UniverHackathon.WebApi.Business;
using UniverHackathon.WebApi.Database;

namespace UniverHackathon.WebApi.Controllers;

[ApiController]
[Route("api/[controller]/")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("create")]
    public async Task<Guid> CreateUser(string? fullName)
    {
        var userConstructor = new CreateUser(_dbContext);
        return await userConstructor.CreateUserInDb(fullName);
    }
}