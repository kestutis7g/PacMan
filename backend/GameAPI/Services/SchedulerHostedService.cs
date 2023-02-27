using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using GameAPI.Hubs;
using GameAPI.Model;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace GameAPI.Services;

public class SchedulerHostedService : HostedServiceBase
{
    private readonly ILogger<SchedulerHostedService> _logger;
    private readonly IOptions<TimerServiceConfiguration> _options;
    private readonly IHubContext<ChatHub> _hubContext;
    public string IP = $"http://{Constants.IP}:5000/";
    private readonly Random _random = new Random();
    public SchedulerHostedService(
    ILoggerFactory loggerFactory,
    IOptions<TimerServiceConfiguration> options,
    IHubContext<ChatHub> hubContext)
    {
        _logger = loggerFactory.CreateLogger<SchedulerHostedService>();
        _options = options;
        _hubContext = hubContext;
    }
    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        await RestartSignal();

        HttpClientHandler clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        HttpClient client = new HttpClient(clientHandler);

        var response = await client.GetAsync($"{IP}api/Map");
        var finalData = await response.Content.ReadAsStringAsync();
        List<MapModel> maps = JsonConvert.DeserializeObject<List<MapModel>>(finalData);

        while (!cancellationToken.IsCancellationRequested)
        {

            //Get players
            // response = await client.GetAsync($"https://localhost:5001/api/GameObject/players");
            // finalData = await response.Content.ReadAsStringAsync();
            // List<GameObjectModel> players = JsonConvert.DeserializeObject<List<GameObjectModel>>(finalData);

            //Get ghosts
            response = await client.GetAsync($"{IP}api/GameObject/ghosts");
            finalData = await response.Content.ReadAsStringAsync();
            List<GameObjectModel> ghosts = JsonConvert.DeserializeObject<List<GameObjectModel>>(finalData);

            using StreamWriter file = new("ErrorsLog.txt", append: true);
        

            //kiekvienam vaiduokliui ieskoma nauja pozicija
            foreach (var ghost in ghosts)
            {
                var parameters = ghost.Parameters.Split(" ");
                MapModel map = null;
                foreach (var m in maps)
                {
                    if(m.Id.ToString() == parameters[0]){
                        map = m;
                    }
                }

                // //surandimi zaidejai tam paciam zaidime su konkreciu vaiduokliu
                // List<GameObjectModel> lobbyPlayers = new List<GameObjectModel>();
                // double closesDistande = double.MaxValue;
                double closesDistande = 0;
                // int targetX = 15, targetY = 15;
                // foreach (var player in players)
                // {
                //     if(ghost.LobbyId == player.LobbyId){
                //         lobbyPlayers.Add(player);
                //         double distance = Math.Pow((double)(ghost.X - player.X),2) + Math.Pow((double)(ghost.Y - player.Y),2);
                //         if( distance < closesDistande){
                //             closesDistande = distance;
                //             if(player.X != null && player.Y != null){
                //                 targetX = (int)player.X-1;
                //                 targetY = (int)player.Y-1;
                //             }
                //         }
                //     }
                // }


                //normalizing coordinates from 1...30 to 0...29
                ghost.X -= 1;
                ghost.Y -= 1;

                int[,] mapArr = new int[30,30];

                //player is present
                if(closesDistande != double.MaxValue && map != null){

                    //getting map data into array
                    var lines = map.Map.Split("\n                        ");
                    for (int y = 0; y < lines.Length; y++)
                    {
                        var values = lines[y].Split(" ");
                        for (int x = 0; x < values.Length; x++)
                        {
                            mapArr[y,x] = Int32.Parse(values[x]);
                        }
                    }

                    //chase player, gets stuck behind walls - not smart
                    // if(ghost.X > targetX && mapArr[(int)ghost.Y, (int)ghost.X - 1] != 1 && mapArr[(int)ghost.Y, (int)ghost.X - 2] != 1){
                    //     await file.WriteLineAsync("ghost "+ ghost.Name + ": " + "Position:  " + ghost.X + " " + ghost.Y + " -X = " + mapArr[(int)ghost.Y, (int)ghost.X - 1]);
                    //     ghost.X -= 1;
                    // }
                    // else if(ghost.X < targetX && mapArr[(int)ghost.Y, (int)ghost.X + 1] != 1 && mapArr[(int)ghost.Y, (int)ghost.X + 2] != 1){
                    //     await file.WriteLineAsync("ghost "+ ghost.Name + ": " + "Position:  " + ghost.X + " " + ghost.Y + " +X = " + mapArr[(int)ghost.Y, (int)ghost.X + 1]);
                    //     ghost.X += 1;
                    // }
                    // else if(ghost.Y > targetY && mapArr[(int)ghost.Y - 1, (int)ghost.X] != 1 && mapArr[(int)ghost.Y - 2, (int)ghost.X] != 1){
                    //     await file.WriteLineAsync("ghost "+ ghost.Name + ": " + "Position:  " + ghost.X + " " + ghost.Y + " -Y = " + mapArr[(int)ghost.Y - 1, (int)ghost.X]);
                    //     ghost.Y -= 1;
                    // }
                    // else if(ghost.Y < targetY && mapArr[(int)ghost.Y + 1, (int)ghost.X] != 1 && mapArr[(int)ghost.Y + 2, (int)ghost.X] != 1){
                    //     await file.WriteLineAsync("ghost "+ ghost.Name + ": " + "Position:  " + ghost.X + " " + ghost.Y + " +Y = " + mapArr[(int)ghost.Y + 1, (int)ghost.X]);
                    //     ghost.Y += 1;
                    // }
                    // else{ //random movement
                    //     bool moved = false;
                    //     while(!moved){
                    //         Random rnd = new Random();
                    //         int dir  = rnd.Next(1, 5);


                    //         if(dir == 1 && mapArr[(int)ghost.Y, (int)ghost.X - 1] != 1){
                    //             ghost.X -= 1;
                    //             moved = true;
                    //         }
                    //         else if(dir == 2 && mapArr[(int)ghost.Y, (int)ghost.X + 1] != 1){
                    //             ghost.X += 1;
                    //             moved = true;
                    //         }
                    //         else if(dir == 3 && mapArr[(int)ghost.Y - 1, (int)ghost.X] != 1){
                    //             ghost.Y -= 1;
                    //             moved = true;
                    //         }
                    //         else if(dir == 4 && mapArr[(int)ghost.Y + 1, (int)ghost.X] != 1){
                    //             ghost.Y += 1;
                    //             moved = true;
                    //         }
                    //     }
                    // }



                    //random movement
                    string oldDirection = parameters.Length > 1 ? parameters[1] : "";
                    string direction = "";
                    bool moved = false;
                    Random rnd = new Random();
                    int changeDirectionChance = rnd.Next(1, 8);

                    if(changeDirectionChance != 7){

                        if(changeDirectionChance == 3){
                            if(oldDirection == "left"){
                                oldDirection = "up";
                            }
                            else if(oldDirection == "right"){
                                oldDirection = "down";
                            }
                            else if(oldDirection == "up"){
                                oldDirection = "right";
                            }
                            else if(oldDirection == "down"){
                                oldDirection = "left";
                            }
                        }

                        if(oldDirection == "left" && (ghost.X == 0 || mapArr[(int)ghost.Y, (int)ghost.X - 1] != 1)){
                            ghost.X -= 1;
                            direction = "left";
                            moved = true;
                        }
                        else if(oldDirection == "right" && (ghost.X == 29 || mapArr[(int)ghost.Y, (int)ghost.X + 1] != 1)){
                            ghost.X += 1;
                            direction = "right";
                            moved = true;
                        }
                        else if(oldDirection == "up" && (ghost.Y == 0 || mapArr[(int)ghost.Y - 1, (int)ghost.X] != 1)){
                            ghost.Y -= 1;
                            direction = "up";
                            moved = true;
                        }
                        else if(oldDirection == "down" && (ghost.Y == 29 || mapArr[(int)ghost.Y + 1, (int)ghost.X] != 1)){
                            ghost.Y += 1;
                            direction = "down";
                            moved = true;
                        }
                    }
                    

                    while(!moved){
                        
                        int dir  = rnd.Next(1, 5);

                        if(dir == 1 && (ghost.X == 0 || mapArr[(int)ghost.Y, (int)ghost.X - 1] != 1)){
                            ghost.X -= 1;
                            direction = "left";
                            moved = true;
                        }
                        else if(dir == 2 && (ghost.X == 29 || mapArr[(int)ghost.Y, (int)ghost.X + 1] != 1)){
                            ghost.X += 1;
                            direction = "right";
                            moved = true;
                        }
                        else if(dir == 3 && (ghost.Y == 0 || mapArr[(int)ghost.Y - 1, (int)ghost.X] != 1)){
                            ghost.Y -= 1;
                            direction = "up";
                            moved = true;
                        }
                        else if(dir == 4 && (ghost.Y == 29 || mapArr[(int)ghost.Y + 1, (int)ghost.X] != 1)){
                            ghost.Y += 1;
                            direction = "down";
                            moved = true;
                        }
                    }
                    
                    ghost.Parameters = parameters[0] + " " + direction;

                    //fix outside position
                    if(ghost.X >= 30){
                        ghost.X = 0;
                    }
                    if(ghost.X < 0){
                        ghost.X = 29;
                    }
                    if(ghost.Y >= 30){
                        ghost.Y = 0;
                    }
                    if(ghost.Y < 0){
                        ghost.Y = 29;
                    }


                    //changing back coordinates from 0...29 to 1...30
                    ghost.X += 1;
                    ghost.Y += 1;
                    

                    string jsonString = JsonConvert.SerializeObject(ghost);
                    var stringContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    HttpResponseMessage httpResponse = await client.PutAsync(IP + "api/GameObject/" + ghost.Id, stringContent);
                }
            }

            await Task.Delay(TimeSpan.FromMilliseconds(_options.Value.Period)*0.5, cancellationToken);
        }
    }
    async Task RestartSignal()
    {
        //Send server restart signal
        await Task.Delay(TimeSpan.FromMilliseconds(5000));
        for (int i = 0; i < 20; i++)
        {
            await Task.Delay(TimeSpan.FromMilliseconds(500));
            await _hubContext.Clients.All.SendAsync("Restart"); 
        }
    }
}

