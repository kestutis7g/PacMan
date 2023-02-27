using System.Collections.Generic;
using System.Threading.Tasks;
using GameAPI.Model;

namespace GameAPI.Data.Client;
public interface IClientRepository
{
    Task SaveChanges();
    Task<ICollection<ClientModel>> GetClientList();
    Task<ClientModel> GetClientById(Guid id);
    Task CreateClient(ClientModel request);
    Task UpdateClient(ClientModel request);
    Task DeleteClient(ClientModel request);
}

