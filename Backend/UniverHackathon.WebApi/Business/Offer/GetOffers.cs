using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Models.Offer;

namespace UniverHackathon.WebApi.Business.Offer;

public class GetOffers
{
    private readonly AppDbContext _dbContext;

    public GetOffers(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<OfferResponse>> GetOffersFromDb()
    {
        return await _dbContext
            .OfferEntities
            .Select(offer => new OfferResponse
            {
                OfferId = offer.OfferId,
                Topic = offer.Topic,
                Description = offer.Description,
                Reviewed = offer.Reviewed,
                UserId = offer.UserId,
            })
            .ToListAsync();
    }
}