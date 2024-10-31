using Microsoft.EntityFrameworkCore;
using UniverHackathon.WebApi.Database;

namespace UniverHackathon.WebApi.Business.Offer;

public class DeleteOffer
{
    private readonly AppDbContext _dbContext;

    public DeleteOffer(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> DeleteOfferInDb(long offerId)
    {
        var existingOffer = await _dbContext
            .OfferEntities
            .SingleOrDefaultAsync(offer => offer.OfferId == offerId);

        if (existingOffer == null)
            throw new Exception("Предложение не найдено");

        _dbContext.OfferEntities.Remove(existingOffer);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}