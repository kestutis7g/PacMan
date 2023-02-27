import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Map } from 'src/app/models/game.types';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  readonly APIUrl = environment.baseUrls.server + environment.baseUrls.apiUrl;

  constructor(private http: HttpClient) { }

  getMapDefaults(){
    return of({
      id: '',
      name: '',
      map: ''
    } as Map);

  }

  getMapList(): Observable<Map[]> {
    return this.http.get<Map[]>(this.APIUrl + 'Map');
  }

  getMapById(id: string): Observable<Map> {
    return this.http.get<Map>(this.APIUrl + 'Map/' + id);
  }

  addMap(request: Map): Observable<Map> {
    return this.http.post<Map>(this.APIUrl + 'Map', request);
  }

  updateMap(id: string, request: Map) {
    return this.http.put(this.APIUrl + 'Map/' + id, request);
  }

  deleteMapFromList(id: string) {
    return this.http.delete(this.APIUrl + 'Map/' + id);
  }
}
