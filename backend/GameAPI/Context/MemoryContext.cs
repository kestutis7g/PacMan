using Microsoft.EntityFrameworkCore;
using GameAPI.Model;

namespace GameAPI.Context;

public class MemoryContext : DbContext
{
    public MemoryContext(DbContextOptions<MemoryContext> options) : base(options)
    {

    }
    public DbSet<ClientModel> Clients => Set<ClientModel>();
    public DbSet<GameObjectModel> GameObjects => Set<GameObjectModel>();
}

