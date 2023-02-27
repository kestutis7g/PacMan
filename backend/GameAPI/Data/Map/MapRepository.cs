using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameAPI.Model;
using Microsoft.EntityFrameworkCore;
using GameAPI.Context;

namespace GameAPI.Data.Map;

public class MapRepository : IMapRepository
{
    public MapRepository(GameContext context)
    {
        _context = context;
    }
    private readonly GameContext _context;
    public Task SaveChanges()
    {
        return _context.SaveChangesAsync();
    }
    public async Task<ICollection<MapModel>> GetMapList()
    {
        var list = _context.Maps.ToList();
        return await Task.FromResult(list);
    }
    public async Task<MapModel> GetMapById(Guid id)
    {
        MapModel model = await _context.Maps.FirstOrDefaultAsync(x => x.Id == id);
        return model;
    }
    public async Task CreateMap(MapModel request)
    {
        await _context.Maps.AddAsync(request);
    }
    public async Task UpdateMap(MapModel request)
    {
        await Task.CompletedTask;
    }
    public async Task DeleteMap(MapModel request)
    {
        if (request is null)
        {
            throw new ArgumentException(nameof(request));
        }
        await Task.FromResult(_context.Maps.Remove(request));
    }
}