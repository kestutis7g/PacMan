using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using GameAPI.Model;

namespace GameAPI.Model;
public class MapModel : BaseEntity
{
    public string Name { get; set; }
    public string Map { get; set; }
}
