using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using UniverHackathon.WebApi.Database.Entities;
using UniverHackathon.WebApi.Models.Jwt;

namespace UniverHackathon.WebApi.Business.Jwt;

public class JwtProvider
{
    private readonly JwtOptions _options;

    public JwtProvider(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public async Task<string> GenerateToken(UserEntity user, UserManager<UserEntity> userManager)
    {
        var userRoles = await userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(ClaimTypes.MobilePhone, user.PhoneNumber ?? throw new Exception("Номер телефона пуст")),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, user.AccountType.ToString())
        };
        claims.AddRange(userRoles.Select(userRole => new Claim(ClaimTypes.Role, userRole)));

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey ?? throw new Exception("Секретный ключ пуст"))),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            signingCredentials: signingCredentials,
            issuer: _options.Issuer,
            audience: _options.Audience,
            expires: DateTime.UtcNow.AddHours(_options.ExpiresHours));

        var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenValue;
    }
}