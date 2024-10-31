using UniverHackathon.WebApi.Database;
using UniverHackathon.WebApi.Database.Entities;
using UniverHackathon.WebApi.Models.Offer;

namespace UniverHackathon.WebApi.Business.Offer;

public class CreateOffer
{
    private readonly AppDbContext _dbContext;

    public CreateOffer(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> CreateNewOffer(Guid userId, CreateOfferRequest request)
    {
        var newOffer = new OfferEntity
        {
            UserId = userId,
            Topic = request.Topic,
            Description = request.Description,
        };

        _dbContext.OfferEntities.Add(newOffer);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}