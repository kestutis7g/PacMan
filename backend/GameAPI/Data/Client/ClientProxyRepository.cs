using GameAPI.Context;
using GameAPI.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameAPI.Data.Client
{
    public class ClientProxyRepository : IClientRepository
    {
        private IClientRepository _repository;
        public ClientProxyRepository(MemoryContext context, ClientRepository repo)
        {
            _context = context;
            _repository= repo;
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
            List<string> blackList = new List<string>() { "asilas" ,"durnius," , "debilas", "nujomnykas"};
            if(!blackList.Contains(request.Name))
            {
                
                //await _repository.CreateClient(request);
                //await _context.Clients.AddAsync(request);
            }
            else
            {
                Console.WriteLine("bad name: {0}", request.Name);
            }
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
}
