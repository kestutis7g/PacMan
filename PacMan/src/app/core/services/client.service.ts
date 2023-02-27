import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from 'src/app/models/game.types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient, private router: Router) {}

  readonly APIUrl = environment.baseUrls.server + environment.baseUrls.apiUrl;

  getClientDefaults() {
    return of({
      id: '',
      name: '',
      lobbyId: '',
      created: '',
    } as Client);
  }

  getClientList(): Observable<Client[]> {
    return this.http.get<Client[]>(this.APIUrl + 'Client');
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(this.APIUrl + 'Client/' + id);
  }

  addClient(request: Client): Observable<Client> {
    return this.http.post<Client>(this.APIUrl + 'ClientProxy', request);
  }

  updateClient(id: string, request: Client) {
    return this.http.put(this.APIUrl + 'ClientProxy/' + id, request);
  }

  deleteClientFromList(id: string) {
    return this.http.delete(this.APIUrl + 'Client/' + id);
  }
}
