using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using GameAPI.Model;

namespace GameAPI.Model;
public class GameObjectModel : BaseEntity
{
    public string? Name { get; set; }
    public Guid? LobbyId { get; set; }
    public int? X { get; set; }
    public int? Y { get; set; }
    public string? Parameters { get; set; }

}
