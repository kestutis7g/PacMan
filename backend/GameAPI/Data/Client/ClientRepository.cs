using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameAPI.Context;
using GameAPI.Model;
using Microsoft.EntityFrameworkCore;

namespace GameAPI.Data.Client;
public class ClientRepository : IClientRepository
{
    public ClientRepository(MemoryContext context)
    {
        _context = context;
    }
    private readonly MemoryContext _context;
    public Task SaveChanges()
    {
        return _context.SaveChangesAsync();
    }
    public async Task<ICollection<ClientModel>> GetClientList()
    {
        var list = _context.Clients.ToList();
        return await Task.FromResult(list);
    }
    public async Task<ClientModel> GetClientById(Guid id)
    {
        ClientModel result = await _context.Clients.FirstOrDefaultAsync(x => x.Id == id);
        return result;
    }
    public async Task CreateClient(ClientModel request)
    {
        await _context.Clients.AddAsync(request);
    }
    public async Task UpdateClient(ClientModel request)
    {
        await Task.CompletedTask;
    }
    public async Task DeleteClient(ClientModel request)
    {
        if (request is null)
        {
            throw new ArgumentException(nameof(request));
        }
        await Task.FromResult(_context.Clients.Remove(request));
    }
}
