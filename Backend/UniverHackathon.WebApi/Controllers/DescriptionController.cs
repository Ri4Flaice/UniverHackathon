using Microsoft.AspNetCore.Mvc;

namespace UniverHackathon.WebApi.Controllers;

[ApiController]
[Route("api/[controller]/")]
public class DescriptionController : ControllerBase
{
    [HttpGet("get")]
    public ActionResult<string?> GetDescription(string? description)
    {
        var returnDescription = Business.GetDescription.GetInputDescription(description);

        return returnDescription;
    }
}