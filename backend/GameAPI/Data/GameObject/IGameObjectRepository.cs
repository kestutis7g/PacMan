using System.Collections.Generic;
using System.Threading.Tasks;
using GameAPI.Model;

namespace GameAPI.Data.GameObject;
public interface IGameObjectRepository
{
    Task SaveChanges();
    Task<ICollection<GameObjectModel>> GetGameObjectList();
    Task<GameObjectModel> GetGameObjectById(Guid id);
    Task<ICollection<GameObjectModel>> GetGameObjectsByLobbyId(Guid lobbyId);
    Task<GameObjectModel> GetGameObjectByLobbyIdAndName(Guid lobbyId, string name);
    Task<ICollection<GameObjectModel>> GetPlayerGameObjects();
    Task<ICollection<GameObjectModel>> GetGhostGameObjects();
    Task CreateGameObject(GameObjectModel request);
    Task UpdateGameObject(GameObjectModel request);
    Task DeleteGameObject(GameObjectModel request);
}

