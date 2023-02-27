using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using GameAPI.Model;

namespace GameAPI.Model;
public class ClientModel : BaseEntity
{
    public string? Name { get; set; }
    public bool? Active { get; set; }
    public Guid? LobbyId { get; set; }
    public DateTime Created { get; set; }
}
