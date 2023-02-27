import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChatMessage } from 'src/app/models/chatMessage.model';
import { GameObject } from 'src/app/models/game.types';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class MediatorService {
  gameObjects = new Subject<string>();

  connectionEstablished = new BehaviorSubject<boolean>(false);

  private hubConnection!: HubConnection;

  constructor() {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  createGameObject(gameObject: GameObject) {
    this.hubConnection.invoke('CreateGameObject', gameObject);
  }
  getGameObjects(lobbyId: string) {
    this.hubConnection.invoke('GetGameObjects', lobbyId);
  }
  updateGameObject(lobbyId: string, gameObject: GameObject) {
    this.hubConnection.invoke('UpdateGameObjectByLobby', lobbyId, gameObject);
  }
  deleteGameObject(lobbyId: string, gameObject: GameObject) {
    this.hubConnection.invoke('DeleteGameObjectByLobby', lobbyId, gameObject);
  }

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.baseUrls.server + 'pacman/mediator', {})
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  private startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        console.log('Mediator connection started!');
        this.connectionEstablished.next(true);
      },
      (error) => console.error(error)
    );
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('GetObjects', (data: string) => {
      //First segment is lobby id
      var gameObjects = data.split(';');
      if (gameObjects[0] == sessionStorage.getItem('lobbyId')) {
        this.gameObjects.next(data);
      }
    });
  }
}
