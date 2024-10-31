using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using UniverHackathon.WebApi.Database.Entities;

namespace UniverHackathon.WebApi.Database;

public class AppDbContext : IdentityDbContext<UserEntity, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
    
    public AppDbContext()
    {
    }

    public DbSet<UserEntity> UserEntities { get; set; }
    public DbSet<EventEntity> EventEntities { get; set; }
    public DbSet<OfferEntity> OfferEntities { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var builder = new ConfigurationBuilder();

            builder.SetBasePath(Directory.GetCurrentDirectory());

            builder.AddJsonFile("appsettings.Local.json");

            var config = builder.Build();
            optionsBuilder.UseNpgsql(config.GetConnectionString("AgentsNetDB"));
        }

        optionsBuilder.ConfigureWarnings(warnings =>
        {
            warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning);
        });
    }
    
}