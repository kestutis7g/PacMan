using Microsoft.EntityFrameworkCore;
using GameAPI.Model;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GameAPI.Context;

public class GameContext : DbContext
{
    public GameContext(DbContextOptions<GameContext> opt) : base(opt)
    {

    }
    public DbSet<LobbyModel> Lobbies => Set<LobbyModel>();
    public DbSet<MapModel> Maps => Set<MapModel>();

    #region Required
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(System.Reflection.Assembly.GetExecutingAssembly());
    }
    #endregion
}
