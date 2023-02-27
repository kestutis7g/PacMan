using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameAPI.Model;
using Microsoft.EntityFrameworkCore;
using GameAPI.Context;

namespace GameAPI.Data.Lobby;
public class LobbyRepository : ILobbyRepository
{
    public LobbyRepository(GameContext context)
    {
        _context = context;
    }
    private readonly GameContext _context;
    public Task SaveChanges()
    {
        return _context.SaveChangesAsync();
    }
    public async Task<ICollection<LobbyModel>> GetLobbyList()
    {
        var list = _context.Lobbies.OrderBy(x => x.Name).ToList();
        return await Task.FromResult(list);
    }
    public async Task<LobbyModel> GetLobbyById(Guid id)
    {
        LobbyModel model = await _context.Lobbies.FirstOrDefaultAsync(x => x.Id == id);
        return model;
    }
    public async Task CreateLobby(LobbyModel request)
    {
        await _context.Lobbies.AddAsync(request);
    }
    public async Task UpdateLobby(LobbyModel request)
    {
        await Task.CompletedTask;
    }
    public async Task DeleteLobby(LobbyModel request)
    {
        if (request is null)
        {
            throw new ArgumentException(nameof(request));
        }
        await Task.FromResult(_context.Lobbies.Remove(request));
    }
}