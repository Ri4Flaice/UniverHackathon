using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Business.Jwt;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Database.Entities;
using UniverHackathon.WebApi.Models.User;

namespace UniverHackathon.WebApi.Business.User;

public class LoginUser
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<UserEntity> _userManager;
    private readonly JwtProvider _jwtProvider;

    public LoginUser(AppDbContext dbContext, UserManager<UserEntity> userManager, JwtProvider jwtProvider)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _jwtProvider = jwtProvider;
    }

    public async Task<string> LoginUserInSystem(LoginUserRequest request)
    {
        var existingUser = await _dbContext
            .UserEntities
            .SingleOrDefaultAsync(user => user.PhoneNumber == request.PhoneNumber);

        if (existingUser == null)
            throw new Exception("Пользователь не найден");
        
        var isPasswordValid =
            await _userManager.CheckPasswordAsync(
                existingUser,
                request.Password ?? throw new Exception("Пароль пуст"));

        if (!isPasswordValid)
            throw new Exception("Неверный пароль");

        var token = await _jwtProvider.GenerateToken(existingUser, _userManager);

        return token;
    }
}