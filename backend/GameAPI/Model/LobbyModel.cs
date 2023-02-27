using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using GameAPI.Model;

namespace GameAPI.Model;
public class LobbyModel : BaseEntity
{
    public string Name { get; set; }
    public int? Level { get; set; }
    public Guid? MapId { get; set; }
    public MapModel Map { get; set; }
    public Guid? Player1 { get; set; }
    public Guid? Player2 { get; set; }
}
