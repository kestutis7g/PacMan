using System.Collections.Generic;

using GameAPI.Hubs;
using GameAPI.Model;
using GameAPI.Data.GameObject;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using GameAPI.Context;
using  Microsoft.EntityFrameworkCore;

namespace GameAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameObjectController : ControllerBase
{
    //private readonly IGameObjectRepository _clientRepository;
    //private readonly MemoryContext _context;

    private readonly IHubContext<ChatHub> _chatHubContext;
    public readonly IGameObjectRepository _repository;

    public GameObjectController(IGameObjectRepository repository, IHubContext<ChatHub> hubContext)
    {
        _repository = repository;
        _chatHubContext = hubContext;
    }

    // GET api/client
    [HttpGet]
    public async Task<ActionResult<ICollection<GameObjectModel>>> GetGameObjectList()
    {
        var list = await _repository.GetGameObjectList();
        if (list is null)
        {
            return NotFound();
        }
        return Ok(list);
    }

    // GET api/client/{id}
    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<GameObjectModel>> GetGameObjectById([FromRoute] Guid id)
    {
        var result = await _repository.GetGameObjectById(id);
        if (result is null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    // GET api/client/{id}
    [HttpGet("lobbyId/{lobbyId:Guid}")]
    public async Task<ActionResult<ICollection<GameObjectModel>>> GetGameObjectsByLobbyId([FromRoute] Guid lobbyId)
    {
        var result = await _repository.GetGameObjectsByLobbyId(lobbyId);
        if (result is null)
        {
            return NotFound();
        }
        return Ok(result);
    }
    // GET api/client/{id}
    [HttpGet("lobbyId/{lobbyId:Guid}/{name}")]
    public async Task<ActionResult<ICollection<GameObjectModel>>> GetGameObjectByLobbyIdAndName([FromRoute] Guid lobbyId, [FromRoute] string name)
    {
        var result = await _repository.GetGameObjectByLobbyIdAndName(lobbyId, name);
        if (result is null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    // GET api/client/{id}
    [HttpGet("players")]
    public async Task<ActionResult<ICollection<GameObjectModel>>> GetPlayerGameObjects()
    {
        var result = await _repository.GetPlayerGameObjects();
        if (result is null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    // GET api/client/{id}
    [HttpGet("ghosts")]
    public async Task<ActionResult<ICollection<GameObjectModel>>> GetGhostGameObjects()
    {
        var result = await _repository.GetGhostGameObjects();
        if (result is null)
        {
            return NotFound();
        }
        return Ok(result);
    }

        // POST api/client
    [HttpPost]
    public async Task<ActionResult> CreateGameObject([FromBody] GameObjectModel request)
    {
        if (request == null)
        {
            return BadRequest();
        }
        await _repository.CreateGameObject(request);

        await _repository.SaveChanges();

        return Created(nameof(request), request);
    }

    // PUT api/client/id
    [HttpPut("{id:Guid}")]
    public async Task<ActionResult> UpdateGameObject([FromRoute] Guid id, [FromBody] GameObjectModel request)
    {
        var model = await _repository.GetGameObjectById(id);
        if(model is null){
            return NotFound();
        }
        //Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + request.X);
        model.Name = !String.IsNullOrEmpty(request.Name) ? request.Name : model.Name;
        model.LobbyId = request.LobbyId != null ? request.LobbyId : model.LobbyId;
        model.X = request.X != null ? request.X : model.X;
        model.Y = request.Y != null ? request.Y : model.Y;
        model.Parameters = !String.IsNullOrEmpty(request.Parameters) ? request.Parameters : model.Parameters;
        

        await _repository.UpdateGameObject(model);

        await _repository.SaveChanges();

        return Ok(model);
    }

    // Delete api/client/{id}
    [HttpDelete("{id:Guid}")]
    public async Task<ActionResult> DeleteGameObjectById([FromRoute] Guid id)
    {

        var result = await _repository.GetGameObjectById(id);
        if (result is null)
            return NotFound("Not a valid object id");

        await _repository.DeleteGameObject(result);

        await _repository.SaveChanges();

        return NoContent();
    }

    // Delete api/client/{id}
    [HttpDelete("{lobbyId:Guid}/{name}")]
    public async Task<ActionResult> DeleteGameObjectByLobbyIdAndName([FromRoute] Guid lobbyId, [FromRoute] string name)
    {

        var result = await _repository.GetGameObjectByLobbyIdAndName(lobbyId, name);
        if (result is null)
            return NotFound("Not valid lobbyId or object name");

        await _repository.DeleteGameObject(result);

        await _repository.SaveChanges();

        return NoContent();
    }
}

