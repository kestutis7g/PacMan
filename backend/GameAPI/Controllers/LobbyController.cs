using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GameAPI.Data.Lobby;
using GameAPI.Model;

namespace GameAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LobbyController : ControllerBase
{
    public LobbyController(ILobbyRepository repository)
    {
        _repository = repository;
    }

    public readonly ILobbyRepository _repository;

    // GET api/lobby
    [HttpGet]
    public async Task<ActionResult<ICollection<LobbyModel>>> GetLobbyList()
    {
        var lobbyList = await _repository.GetLobbyList();
        if (lobbyList is null)
        {
            return NotFound();
        }
        return Ok(lobbyList);
    }

    // GET api/lobby/{id}
    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<LobbyModel>> GetLobbyById([FromRoute] Guid id)
    {
        var lobbyFromRepo = await _repository.GetLobbyById(id);
        if (lobbyFromRepo is null)
        {
            return NotFound();
        }
        return Ok(lobbyFromRepo);
    }

    // POST api/lobby
    [HttpPost]
    public async Task<ActionResult> CreateLobby([FromBody] LobbyModel lobbyModel)
    {
        await _repository.CreateLobby(lobbyModel);

        await _repository.SaveChanges();

        return NoContent();
    }

    // PUT api/lobby/id
    [HttpPut("{id:Guid}")]
    public async Task<ActionResult> UpdateLobby([FromRoute] Guid id, [FromBody] LobbyModel lobbyModel)
    {
        var model = await _repository.GetLobbyById(id);
        if(model is null){
            return NotFound();
        }
        // model.Name = lobbyModel.Name ?? model.Name;
        // model.Picture = lobbyModel.Picture ?? model.Picture;
        // model.Price = lobbyModel.Price ?? model.Price;
        // model.Description = lobbyModel.Description ?? model.Description;
        // model.Quantity = lobbyModel.Quantity ?? model.Quantity;
        // model.Discount = lobbyModel.Discount ?? model.Discount;
        // model.Type = lobbyModel.Type ?? model.Type;

        model.Name = !String.IsNullOrEmpty(lobbyModel.Name) ? lobbyModel.Name : model.Name;
        model.Level = lobbyModel.Level ?? model.Level;

        await _repository.UpdateLobby(model);

        await _repository.SaveChanges();

        return NoContent();
    }

    // PUT api/lobby/id/add/playerId
    [HttpGet("{id:Guid}/add/{playerId:Guid}")]
    public async Task<ActionResult<Guid>> AddPlayerToLobby([FromRoute] Guid id, [FromRoute] Guid playerId)
    {
        var model = await _repository.GetLobbyById(id);
        if(model is null){
            return NotFound();
        }

        if(model.Player1 is null){
            model.Player1 = playerId;
        }
        else if(model.Player2 is null){
            model.Player2 = playerId;
        }
        else{
            return StatusCode(406);
        }

        await _repository.UpdateLobby(model);

        await _repository.SaveChanges();

        return Ok(playerId);
    }

    // PUT api/lobby/id/remove/playerId
    [HttpDelete("{id:Guid}/remove/{playerId:Guid}")]
    public async Task<ActionResult> RemovePlayerFromLobby([FromRoute] Guid id, [FromRoute] Guid playerId)
    {
        var model = await _repository.GetLobbyById(id);
        if(model is null){
            return NotFound();
        }
        if(model.Player1 == playerId){
            model.Player1 = null;
        }
        else if(model.Player2 == playerId){
            model.Player2 = null;
        }
        else{
            return NotFound();
        }
        await _repository.UpdateLobby(model);
        await _repository.SaveChanges();
        return NoContent();
    }

    // Delete api/lobby/{id}
    [HttpDelete("{id:Guid}")]
    public async Task<ActionResult> DeleteLobbyById([FromRoute] Guid id)
    {
        var lobby = await _repository.GetLobbyById(id);
        if (lobby is null)
            return NotFound("Not a valid lobby id");
        await _repository.DeleteLobby(lobby);
        await _repository.SaveChanges();
        return NoContent();
    }
}
