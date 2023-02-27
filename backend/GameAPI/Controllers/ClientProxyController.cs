using System.Collections.Generic;

using GameAPI.Hubs;
using GameAPI.Model;
using GameAPI.Data.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using GameAPI.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace GameAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientProxyController : ControllerBase
{
    //private readonly IClientRepository _clientRepository;
    //private readonly MemoryContext _context;

    private readonly IHubContext<ChatHub> _chatHubContext;
    public readonly IClientRepository _repository;

    public ClientProxyController(IClientRepository repository, IHubContext<ChatHub> hubContext)
    {
        _repository = repository;
        _chatHubContext = hubContext;
    }

     // PUT api/client/id
    [HttpPut("{id:Guid}")]
    public async Task<ActionResult> UpdateClient([FromRoute] Guid id, [FromBody] ClientModel request)
    {
        List<string> blackList = new List<string>() { "asilas" ,"durnius," , "debilas", "nujomnykas"};
        if(!blackList.Contains(request.Name))
        {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

        HttpClient client = new HttpClient(clientHandler);

        string jsonString = JsonConvert.SerializeObject(request);
        var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
        var response = await client.PutAsync("https://localhost:5001/api/Client/"+id, stringContent);
        var finalData = await response.Content.ReadAsStringAsync();
        ClientModel model = JsonConvert.DeserializeObject<ClientModel>(finalData);
        return Ok(model);
        }
        else{
            
            return Forbid();
        }

    }
    // POST api/client
    [HttpPost]
    public async Task<ActionResult> CreateClient([FromBody] ClientModel request)
    {
        if (request == null)
        {
            return BadRequest();
        }
        List<string> blackList = new List<string>() { "asilas" ,"durnius," , "debilas", "nujomnykas"};
        if(!blackList.Contains(request.Name))
        {
            HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

        HttpClient client = new HttpClient(clientHandler);

        string jsonString = JsonConvert.SerializeObject(request);
        var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
        HttpResponseMessage response = await client.PostAsync("https://localhost:5001/api/Client", stringContent);
        return NoContent();
        }
        else{
            return NoContent();
        }
    }
}

