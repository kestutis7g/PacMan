using System.Net.Http;
using System.Threading.Tasks;
using GameAPI.Model;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using System.Text;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.IO;

namespace GameAPI.Hubs;

public class Mediator : Hub
{
    public string IP = $"http://{Constants.IP}:5000/";
    public async Task CreateGameObject(GameObjectModel gameObject)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        HttpClient client = new HttpClient(clientHandler);

        //Get gameObject
        var response = await client.GetAsync($"{IP}api/GameObject/lobbyId/{gameObject.LobbyId}/{gameObject.Name}");
        var finalData = await response.Content.ReadAsStringAsync();
        GameObjectModel result = JsonConvert.DeserializeObject<GameObjectModel>(finalData);

        //Lobby'je nerastas objektas, todel jis yra sukuriamas
        if(result.Id != null && result.Name != null && result.Name != ""){
            

            string jsonString = JsonConvert.SerializeObject(gameObject);
            var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

            HttpResponseMessage httpResponse = await client.PutAsync(IP + "api/GameObject/" + gameObject.Id, stringContent);
        }
        else{
            string jsonString = JsonConvert.SerializeObject(gameObject);
            var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");

            HttpResponseMessage responseMessage = await client.PostAsync(IP + "api/GameObject", stringContent);
            
        }
        
        //await Clients.All.SendAsync("Send", chatMessage);
    }
    public async Task GetGameObjects(string lobbyId)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        HttpClient client = new HttpClient(clientHandler);

        //Get gameObject
        var response = await client.GetAsync($"{IP}api/GameObject/lobbyId/{lobbyId}");
        var finalData = await response.Content.ReadAsStringAsync();
        List<GameObjectModel> gameObjects = JsonConvert.DeserializeObject<List<GameObjectModel>>(finalData);

        //visi lobby gameObject sudedami i viena string is kurio galima pasiimti reiksmes
        
        string result = lobbyId.ToString() + ";";
        if(gameObjects != null){

            foreach (var gameObject in gameObjects)
            {
                result += gameObject.Name + " " + gameObject.X + " " + gameObject.Y;
                if(gameObject.Parameters != ""){
                    result += " " + gameObject.Parameters + ";";
                }
                else{
                    result += ";";
                }
            }
            await Clients.All.SendAsync("GetObjects", result);
        }
        
    }
    public async Task UpdateGameObjectByLobby(string lobbyId, GameObjectModel gameObject)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        HttpClient client = new HttpClient(clientHandler);

        //Get gameObject
        var response = await client.GetAsync($"{IP}api/GameObject/lobbyId/{lobbyId}/{gameObject.Name}");
        var finalData = await response.Content.ReadAsStringAsync();
        GameObjectModel result = JsonConvert.DeserializeObject<GameObjectModel>(finalData);


        // using StreamWriter file = new("ErrorsLog.txt", append: true);
        // await file.WriteLineAsync("lobbyId: " + lobbyId + "   finalData: " + finalData);

        //Put gameObject
        string jsonString = JsonConvert.SerializeObject(gameObject);
        var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
        HttpResponseMessage httpResponse = await client.PutAsync(IP + "api/GameObject/" + result.Id, stringContent);
    }

    public async Task DeleteGameObjectByLobby(string lobbyId, GameObjectModel gameObject)
    {
        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        HttpClient client = new HttpClient(clientHandler);

        //Get gameObject
        var response = await client.DeleteAsync($"{IP}api/GameObject/{lobbyId}/{gameObject.Name}");
        var finalData = await response.Content.ReadAsStringAsync();
        GameObjectModel result = JsonConvert.DeserializeObject<GameObjectModel>(finalData);

    }
    
}

