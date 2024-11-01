using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UniverHackathon.WebApi.Business.Jwt;
using UniverHackathon.WebApi.Business.User;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Database.Entities;
using UniverHackathon.WebApi.Models.Roles;
using UniverHackathon.WebApi.Models.User;

namespace UniverHackathon.WebApi.Controllers;

[ApiController]
[Route("api/[controller]/")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<UserEntity> _userManager;
    private readonly JwtProvider _jwtProvider;

    public UserController(AppDbContext dbContext, UserManager<UserEntity> userManager, JwtProvider jwtProvider)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _jwtProvider = jwtProvider;
    }

    [HttpPost("create")]
    public async Task<bool> CreateUser(CreateUserRequest request)
    {
        var userConstructor = new CreateUser(_dbContext, _userManager);
        return await userConstructor.CreateUserInDb(request);
    }

    [HttpPost("login")]
    public async Task<string> LoginUser(LoginUserRequest request)
    {
        var userConstructor = new LoginUser(_dbContext, _userManager, _jwtProvider);

        return await userConstructor.LoginUserInSystem(request);
    }

    [HttpPatch("edit")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<UserEntity> EditUser(EditUserRequest request)
    {
        var userConstructor = new EditUser(_dbContext);

        return await userConstructor.EditUserInDb(request);
    }

    [HttpGet("getUserRatingList")]
    public async Task<IEnumerable<UserRating>> GetUserRatingList()
    {
        var getListUserRatingConstructor = new GetListUserRating(_dbContext);

        return await getListUserRatingConstructor.GetUsersRating();
    }

    [HttpPatch("addUserRatingForOffer")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<bool> AddUserRatingForOffer([FromQuery] Guid userId)
    {
        var addUserRatingConstructor = new AddUserRating(_dbContext);

        return await addUserRatingConstructor.AddUserRatingForOffer(userId);
    }
}