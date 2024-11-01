using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Models.Offer;

namespace UniverHackathon.WebApi.Business.Offer;

public class EditOffer
{
    private readonly AppDbContext _dbContext;

    public EditOffer(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OfferResponse> EditOfferInDb(long offerId)
    {
        var existingOffer = await _dbContext
            .OfferEntities
            .FirstOrDefaultAsync(offer => offer.OfferId == offerId);

        if (existingOffer == null)
            throw new Exception("Предложение не найдено");

        existingOffer.Reviewed = true;

        var existingUser = await _dbContext
            .UserEntities
            .FirstOrDefaultAsync(user => existingOffer.UserId == user.Id);

        if (existingUser != null) existingUser.Rating += 3;

        await _dbContext.SaveChangesAsync();

        var offerResponse = new OfferResponse
        {
            OfferId = existingOffer.OfferId,
            Topic = existingOffer.Topic,
            Description = existingOffer.Description,
            Reviewed = existingOffer.Reviewed,
            UserId = existingOffer.UserId,
        };

        return offerResponse;
    }
}