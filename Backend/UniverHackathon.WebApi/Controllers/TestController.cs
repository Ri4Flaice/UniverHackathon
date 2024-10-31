using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniverHackathon.WebApi.Models.Roles;

namespace UniverHackathon.WebApi.Controllers;

[ApiController]
[Route("api/[controller]/")]
public class TestController
{
    [HttpGet("get")]
    [Authorize(Roles = UserRoles.Admin)]
    public ActionResult<string> GetInfo()
    {
        return "SSSS";
    }
}