using System.Net.Http;
using System.Threading.Tasks;
using GameAPI.Model;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using System.Text;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace GameAPI.Hubs;

public class ChatHub : Hub
{
    public string IP = $"https://{Constants.IP}:5001/";
    public async Task SendMessage(ChatMessage chatMessage)
    {
        await Clients.All.SendAsync("Send", chatMessage);
    }
    public async Task SendCoordinates(ChatMessage chatMessage)
    {
        await Clients.All.SendAsync("Coordinates", chatMessage);
    }
    public async Task Ping(Guid clientId)
    {
        ClientModel clientRequest = new ClientModel();
        clientRequest.Active = true;
        string jsonString = JsonConvert.SerializeObject(clientRequest);
        var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
        
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        HttpClient client = new HttpClient(clientHandler);

        var response = await client.PutAsync(IP + "api/Client/" + clientId, stringContent);
    }
    public async Task ClearPing()
    {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        HttpClient client = new HttpClient(clientHandler);

        var response = await client.GetAsync(IP + "api/Client/");
        var finalData = await response.Content.ReadAsStringAsync();

        List<ClientModel> dataResponse = JsonConvert.DeserializeObject<List<ClientModel>>(finalData);

        ClientModel clientRequest = new ClientModel();
        clientRequest.Active = null;
        string jsonString = JsonConvert.SerializeObject(clientRequest);
        var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

        foreach (var user in dataResponse)
        {
            response = await client.PutAsync(IP + "api/Client/" + user.Id, stringContent);
        }
    }

    public override Task OnConnectedAsync()
    {
        // Add your own code here.
        // For example: in a chat application, mark the user as offline, 
        // delete the association between the current connection id and user name.
        //Console.WriteLine(base.Context.ConnectionId);
        //Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + base.Context.ConnectionId);
        //Clients.Caller.SendAsync("SignalRCreated", base.Context.ConnectionId);
        
        return base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        //Console.WriteLine(base.Context.ConnectionId);
        //Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + base.Context.ConnectionId);

        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        HttpClient client = new HttpClient(clientHandler);
        //Get all lobbies
        var response = await client.GetAsync(IP + "api/Lobby/");
        var finalData = await response.Content.ReadAsStringAsync();
        List<LobbyModel> lobbyList = JsonConvert.DeserializeObject<List<LobbyModel>>(finalData);

        //Sending ping requests for all users in lobbies
        for (int i = 0; i < 5; i++)
        {
            await Task.Delay(TimeSpan.FromMilliseconds(1000));

            foreach (var lobby in lobbyList)
            {
                if(lobby.Player1 != null)
                {
                    await Clients.All.SendAsync("Ping", lobby.Player1);
                }
                if(lobby.Player2 != null)
                {
                    await Clients.All.SendAsync("Ping", lobby.Player2);

                }
            }
        }
        //Time to respond
        await Task.Delay(TimeSpan.FromMilliseconds(5000));

        //Getting information about clients
        response = await client.GetAsync(IP + "api/Client/");
        finalData = await response.Content.ReadAsStringAsync();
        List<ClientModel> clientList = JsonConvert.DeserializeObject<List<ClientModel>>(finalData);

        List<Guid> successfulPing = new List<Guid>();
        foreach (var c in clientList)
        {
            if(c.Active == true)
            {
                successfulPing.Add(c.Id);
            }
        }
        //Disconnecting clients who didn't respond
        foreach (var lobby in lobbyList)
        {
            if(lobby.Player1 != null)
            {
                if(successfulPing.Count == 0 || !successfulPing.Contains(lobby.Player1.Value))
                {
                    response = await client.DeleteAsync($"{IP}api/Lobby/{lobby.Id}/remove/{lobby.Player1}");
                    
                    Console.WriteLine($"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Disconnected player {lobby.Player1} from lobby {lobby.Id}");
                }
            }
            if(lobby.Player2 != null)
            {
                if(successfulPing.Count == 0 || !successfulPing.Contains(lobby.Player2.Value))
                {
                    response = await client.DeleteAsync($"{IP}api/Lobby/{lobby.Id}/remove/{lobby.Player2}");
                    
                    Console.WriteLine($"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Disconnected player {lobby.Player2} from lobby {lobby.Id}");
                }
            }
        }
        await ClearPing();
    }

    public async Task CreateClient(ClientModel request)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        // Pass the handler to httpclient(from you are calling api)
        HttpClient client = new HttpClient(clientHandler);
        Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        for (int i = 0; i < 3; i++)
        {
            try
            {
                Guid id = Guid.NewGuid();
                //Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!   Guid = " + id);
                request.Id = id;

                string jsonString = JsonConvert.SerializeObject(request);
                Console.WriteLine(request.Name + "  " + request.Id + "CIA REQUESTAS NEPAMESK");
                var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                Console.WriteLine(stringContent);
                Console.WriteLine(jsonString);
                //Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + jsonString);
                //Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + stringContent);
                HttpResponseMessage response = await client.PostAsync(IP + "api/ClientProxy", stringContent);
                
                
                if(response.StatusCode.ToString() == "OK" || response.StatusCode.ToString() == "NoContent" || response.StatusCode.ToString() == "Created")
                {
                    await Clients.Caller.SendAsync("ClientCreated", request);
                    break;
                }
                else
                {
                    Console.WriteLine("Client creation unsucessful!");
                }

            }
            catch (System.Exception)
            {
                throw;
            }
        }
        
    }


    public async Task ConnectClientToLobby(Guid clientId, Guid lobbyId)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        // Pass the handler to httpclient(from you are calling api)
        HttpClient client = new HttpClient(clientHandler);
        
        try
        {
            ///Update Lobby
            HttpResponseMessage response = await client.GetAsync(IP + "api/Lobby/" + lobbyId + "/add/" + clientId);

            if(response.StatusCode.ToString() == "NotAcceptable")
            {
                await Clients.Caller.SendAsync("ClientUpdated", "406");
            }
            else if(response.StatusCode.ToString() == "NotFound")
            {
                await Clients.Caller.SendAsync("ClientUpdated", "404");
            }
            else
            {
                //Update Client
                ClientModel clientRequest = new ClientModel();
                clientRequest.LobbyId = lobbyId;
            
                string jsonString = JsonConvert.SerializeObject(clientRequest);
                var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

                //Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + jsonString);
                //Console.WriteLine("!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + stringContent);
                response = await client.PutAsync(IP + "api/Client/" + clientId, stringContent);

                if(response.StatusCode.ToString() == "NotFound")
                {
                    await Clients.Caller.SendAsync("ClientUpdated", "404");
                }
                else
                {
                    await Clients.Caller.SendAsync("ClientUpdated", "200");
                }
            }

        }
        catch (System.Exception)
        {
            throw;
        }
        
    }

    public async Task DisconnectClientFromLobby(Guid clientId, Guid lobbyId)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        // Pass the handler to httpclient(from you are calling api)
        HttpClient client = new HttpClient(clientHandler);

        try
        {
            ClientModel clientRequest = new ClientModel();
            clientRequest.LobbyId = new Guid();
            
            string jsonString = JsonConvert.SerializeObject(clientRequest);
            var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PutAsync(IP + "/api/Client/" + clientId, stringContent);

            response = await client.DeleteAsync(IP + "api/Lobby/" + lobbyId + "/remove/" + clientId);
            
            await Clients.Caller.SendAsync("ClientUpdated", "200");
                
        }
        catch (System.Exception)
        {
            throw;
        }
    }
}

