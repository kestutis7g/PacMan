import { Injectable, Injector } from '@angular/core';
import { ChatMessage } from 'src/app/models/chatMessage.model';
import { Client, GameObject } from 'src/app/models/game.types';
import { ClientService } from './client.service';
import { LobbyService } from './lobby.service';
import { MapService } from './map.service';
import { MediatorService } from './mediator.service';
import { SignalRService } from './signalR.service';

@Injectable({ providedIn: 'root' })
export class FacadeService {
  constructor(private injector: Injector) {}

  private _clientService?: ClientService;
  public get clientService(): ClientService {
    if (!this._clientService) {
      this._clientService = this.injector.get(ClientService);
    }
    return this._clientService;
  }

  getClientById(id: string) {
    return this.clientService.getClientById(id);
  }

  updateClient(id: string, client: Client) {
    return this.clientService.updateClient(id, client);
  }

  //###############################################################################################################################################################

  private _lobbyService?: LobbyService;
  public get lobbyService(): LobbyService {
    if (!this._lobbyService) {
      this._lobbyService = this.injector.get(LobbyService);
    }
    return this._lobbyService;
  }

  getLobbyList() {
    return this.lobbyService.getLobbyList();
  }

  getLobbyById(id: string) {
    return this.lobbyService.getLobbyById(id);
  }

  //###############################################################################################################################################################

  private _mapService?: MapService;
  public get mapService(): MapService {
    if (!this._mapService) {
      this._mapService = this.injector.get(MapService);
    }
    return this._mapService;
  }

  getMapById(id: string) {
    return this.mapService.getMapById(id);
  }

  //###############################################################################################################################################################

  private _signalRService?: SignalRService;
  public get signalRService(): SignalRService {
    if (!this._signalRService) {
      this._signalRService = this.injector.get(SignalRService);
    }
    return this._signalRService;
  }

  sendChatMessage(message: ChatMessage) {
    return this.signalRService.sendChatMessage(message);
  }

  createClient(client: Client) {
    this.signalRService.createClient(client);
  }

  connectClientToLobby(clientId: string, lobbyId: string) {
    this.signalRService.connectClientToLobby(clientId, lobbyId);
  }

  disconnectClientFromLobby(clientId: string, lobbyId: string) {
    this.signalRService.disconnectClientFromLobby(clientId, lobbyId);
  }
  //###############################################################################################################################################################

  private _mediatorService?: MediatorService;
  public get mediatorService(): MediatorService {
    if (!this._mediatorService) {
      this._mediatorService = this.injector.get(MediatorService);
    }
    return this._mediatorService;
  }

  sendChatMessageMediator(gameObject: GameObject) {
    return this.mediatorService.createGameObject(gameObject);
  }
}
