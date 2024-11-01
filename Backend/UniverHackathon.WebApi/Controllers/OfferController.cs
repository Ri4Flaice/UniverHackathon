using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniverHackathon.WebApi.Business.Offer;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Models.Offer;
using UniverHackathon.WebApi.Models.Roles;

namespace UniverHackathon.WebApi.Controllers;

[ApiController]
[Route("api/[controller]/")]
public class OfferController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public OfferController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<bool> CreateOffer(CreateOfferRequest request)
    {
        var createOfferConstructor = new CreateOffer(_dbContext);

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId)) return false;

        return await createOfferConstructor.CreateNewOffer(userId, request);
    }

    [HttpGet("getOffers")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<List<OfferResponse>> GetOffers()
    {
        var getOffersConstructor = new GetOffers(_dbContext);

        return await getOffersConstructor.GetOffersFromDb();
    }

    [HttpPatch("update")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<OfferResponse> EditOffer([FromQuery] long offerId)
    {
        var editOfferConstructor = new EditOffer(_dbContext);

        return await editOfferConstructor.EditOfferInDb(offerId);
    }

    [HttpDelete("deleteOffer")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<bool> DeleteOffer([FromQuery] long offerId)
    {
        var deleteOfferConstructor = new DeleteOffer(_dbContext);

        return await deleteOfferConstructor.DeleteOfferInDb(offerId);
    }
}