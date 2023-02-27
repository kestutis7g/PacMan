using System.Text.Json;
using GameAPI.Hubs;
using GameAPI.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using GameAPI.Context;
using GameAPI.Data.Lobby;
using GameAPI.Data.Client;
using GameAPI.Data.Map;
using GameAPI.Data.GameObject;

namespace GameAPI.Web;

public class Startup
{
    readonly string CorsPolicy = "CorsPolicy";
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }
    public IConfiguration Configuration { get; }
    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(CorsPolicy,
                builder =>
                {
                    builder
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:3000", "http://localhost:4200", $"http://{Constants.IP}:4200")
                        .AllowCredentials();
                });
        });
        services.Configure<TimerServiceConfiguration>(Configuration.GetSection("TimeService"));
        services.AddSingleton<IHostedService, SchedulerHostedService>();
        services.AddSignalR()
            .AddJsonProtocol(options =>
            {

                options.PayloadSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });
        
        services.AddControllers()
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "GameAPI", Version = "v1" });
        });
        services.AddDbContext<MemoryContext>(opt => opt.UseInMemoryDatabase("MemoryContext"));
        services.AddDbContext<GameContext>(opt => opt.UseSqlServer
            (Configuration.GetConnectionString("PacMan")));
        services.AddScoped<IClientRepository, ClientRepository>();
        services.AddScoped<IGameObjectRepository, GameObjectRepository>();
        services.AddScoped<ILobbyRepository, LobbyRepository>();
        services.AddScoped<IMapRepository, MapRepository>();
        //services.AddScoped<IClientRepository, ClientProxyRepository>();
    }
    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "GameAPI v1"));
        }
        app.UseHttpsRedirection();
        app.UseCors(CorsPolicy);
        app.UseDefaultFiles();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHub<ChatHub>("/pacman");
            endpoints.MapHub<Mediator>("/pacman/mediator");
        });
        using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
        {
            var context = serviceScope.ServiceProvider.GetService<GameContext>();
            context.Database.Migrate();
        }
    }
}
