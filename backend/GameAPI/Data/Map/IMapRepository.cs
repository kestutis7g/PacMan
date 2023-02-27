using System.Collections.Generic;
using System.Threading.Tasks;
using GameAPI.Model;

namespace GameAPI.Data.Map;
public interface IMapRepository
{
    Task SaveChanges();
    Task<ICollection<MapModel>> GetMapList();
    Task<MapModel> GetMapById(Guid id);
    Task CreateMap(MapModel request);
    Task UpdateMap(MapModel request);
    Task DeleteMap(MapModel request);
}