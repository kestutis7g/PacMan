using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GameAPI.Data.Map;
using GameAPI.Model;

namespace GameAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapController : ControllerBase
{
    public MapController(IMapRepository repository)
    {
        _repository = repository;
    }

    public readonly IMapRepository _repository;

    // GET api/map
    [HttpGet]
    public async Task<ActionResult<ICollection<MapModel>>> GetMapList()
    {
        var list = await _repository.GetMapList();
        if (list is null)
        {
            return NotFound();
        }
        return Ok(list);
    }


    // GET api/map/{id}
    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<MapModel>> GetMapById([FromRoute] Guid id)
    {
        var mapFromRepo = await _repository.GetMapById(id);
        if (mapFromRepo is null)
        {
            return NotFound();
        }
        return Ok(mapFromRepo);
    }

    // POST api/map
    [HttpPost]
    public async Task<ActionResult> CreateMap([FromBody] MapModel mapModel)
    {
        await _repository.CreateMap(mapModel);

        await _repository.SaveChanges();

        return NoContent();
    }

    // PUT api/map/id
    [HttpPut("{id:Guid}")]
    public async Task<ActionResult> UpdateMap([FromRoute] Guid id, [FromBody] MapModel mapModel)
    {
        var model = await _repository.GetMapById(id);
        if(model is null){
            return NotFound();
        }

        model.Name = !String.IsNullOrEmpty(mapModel.Name) ? mapModel.Name : model.Name;
        model.Map = mapModel.Map ?? model.Map;

        await _repository.UpdateMap(model);

        await _repository.SaveChanges();

        return NoContent();
    }

    // Delete api/map/{id}
    [HttpDelete("{id:Guid}")]
    public async Task<ActionResult> DeleteMapById([FromRoute] Guid id)
    {

        var map = await _repository.GetMapById(id);
        if (map is null)
            return NotFound("Not a valid map id");

        await _repository.DeleteMap(map);

        await _repository.SaveChanges();
        return NoContent();
    }
}
