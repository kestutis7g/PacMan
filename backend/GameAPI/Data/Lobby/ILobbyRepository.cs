using System.Collections.Generic;
using System.Threading.Tasks;
using GameAPI.Model;

namespace GameAPI.Data.Lobby;
public interface ILobbyRepository
{
    Task SaveChanges();
    Task<ICollection<LobbyModel>> GetLobbyList();
    Task<LobbyModel> GetLobbyById(Guid id);
    Task CreateLobby(LobbyModel request);
    Task UpdateLobby(LobbyModel request);
    Task DeleteLobby(LobbyModel request);
}
