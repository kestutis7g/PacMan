import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lobby } from 'src/app/models/game.types';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  readonly APIUrl = environment.baseUrls.server + environment.baseUrls.apiUrl;

  constructor(private http: HttpClient) {}

  getLobbyDefaults() {
    return of({
      id: '',
      name: '',
      level: 0,
      mapId: '',
      player1: '',
      player2: '',
    } as Lobby);
  }

  getLobbyList(): Observable<Lobby[]> {
    return this.http.get<Lobby[]>(this.APIUrl + 'Lobby');
  }

  getLobbyById(id: string): Observable<Lobby> {
    return this.http.get<Lobby>(this.APIUrl + 'Lobby/' + id);
  }

  addLobby(request: Lobby): Observable<Lobby> {
    return this.http.post<Lobby>(this.APIUrl + 'Lobby', request);
  }

  updateLobby(id: string, request: Lobby) {
    return this.http.put(this.APIUrl + 'Lobby/' + id, request);
  }

  addPlayerToLobby(id: string, playerId: string) {
    return this.http.get(this.APIUrl + 'Lobby/' + id + '/add/' + playerId);
  }

  removePlayerFromLobby(id: string, playerId: string) {
    return this.http.delete(
      this.APIUrl + 'Lobby/' + id + '/remove/' + playerId
    );
  }

  deleteLobbyFromList(id: string) {
    return this.http.delete(this.APIUrl + 'Lobby/' + id);
  }
}
